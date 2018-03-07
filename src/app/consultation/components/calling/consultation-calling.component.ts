import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuardService } from '../../../shared/services/guard.service';
import { ReferencesService } from '../../services/references.service';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { ProfileApiService } from '../../../shared/services/profile-api.service';
import { ICanDeactivateComponent } from '../../../guard/can-deactivate-dialog.guard';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogComponent, IDialogData } from '../../../shared/components/dialog/dialog.component';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-consulting-calling',
  templateUrl: './consultation-calling.component.html',
  styleUrls: ['./consultation-calling.component.scss']
})
export class ConsultationCallingComponent implements OnInit, ICanDeactivateComponent {

  selectedDock;
  dockCategory;
  waiting_time;
  show_waiting_time;
  req_id;
  check_for_free_doctor = 0;

  checked_doctor_rank;
  timer;
  interval;
  start_interval: boolean = true;
  cancel_interval: boolean;
  estimate_start_datetime;
  countDown;
  count_resend = 0;
  check_time: boolean = false;
  null_time_text;
  before_waiting_time: boolean = true;
  before_waiting_time_interval;
  check_time_out: boolean = true;
  wrong_routing_modal_message;
  loading: boolean = true;

  private canDeactivateFlag = false;

  constructor(private router: Router,
              private referenceService: ReferencesService,
              private guardServ: GuardService,
              private profileApi: ProfileApiService,
              private dialog: MatDialog) {
    this.profileApi.checkOrLogout();
    this.guardServ.nav_footer.footer_show = false;
  }


  ngOnInit() {
    localStorage.setItem('page1', 'true');
    if (localStorage.getItem('page2') !== 'true') {
      this.req_id = localStorage.getItem('req_id');
      console.log('request id = ', this.req_id, ' - consultation calling component');


      this.before_waiting_time_interval = setInterval(() => {
        if (this.before_waiting_time) {
          console.log('check');

          this.referenceService.getAppointmentId(this.req_id).subscribe(response => {
            if (response['appointment_id'] !== null) {
              console.log('gtav arajin checki jamanak');
              this.referenceService.getInfoAppointment(response['appointment_id']).subscribe(response => {
                console.log('estimated_meeting_start_countdown for waiting time component', response['estimated_meeting_start_countdown']);
                localStorage.setItem('start_time', response['estimated_meeting_start_countdown']);
                // clearInterval(this.interval);
                this.check_time_out = false;
                clearInterval(this.before_waiting_time_interval);
                this.canDeactivateFlag = true;
                this.router.navigate(['./consultation/waiting-doctor']);
              });

            }
          });
        }
      }, 5 * 1000);
      //selected doctor's rank
      this.checked_doctor_rank = this.referenceService.checked_doctor_rank;
      //get ranks list
      this.referenceService.getRanks().subscribe(response => {
        console.log(response);
        this.dockCategory = response;
        this.loading = false;
      });


      //get waiting time from local storage
      this.waiting_time = localStorage.getItem('waiting_time');
      // this.waiting_time = 0
      if (this.waiting_time == 0) {
        this.check_time = true;
        // this.null_time_text = 'Свободного доктора сейчас нет, подождите пожалуйста.'
      }
      console.log('waiting time (searching_for_doctor_estimated_countdown): ', this.waiting_time, ' - consultation calling component');

      this.getTimer(this.waiting_time);


      this.cancel_interval = true;

      //timer for call
      this.timer = setTimeout(() => {
        clearInterval(this.before_waiting_time_interval);
        this.before_waiting_time = false;
        console.log('aaaaaaaaaaa');
        if (this.check_time_out) {


          console.log('cleared before checking');

          //get appointment_id by request_id
          this.referenceService.getAppointmentId(this.req_id).subscribe(response => {
            console.log('first step - appointment id by response id = ', response['appointment_id'], ' - consultation calling component');
            if (response['appointment_id'] == null) {
              this.getTimer(300);
              this.check_time = true;

              this.interval = setInterval(() => {
                if (this.cancel_interval) {
                  this.start_interval = true;
                  this.referenceService.getAppointmentId(this.req_id).subscribe(response => {
                    console.log('intervali meja mtel mana galis ', response['appointment_id']);
                    if (response['appointment_id'] !== null) {
                      this.referenceService.getInfoAppointment(response['appointment_id']).subscribe(response => {
                        console.log('consultation calling  - estimated_meeting_start_countdown for waiting time component ', response['estimated_meeting_start_countdown']);
                        localStorage.setItem('start_time', response['estimated_meeting_start_countdown']);
                      });
                      clearInterval(this.interval);
                      clearInterval(this.before_waiting_time_interval);
                      this.canDeactivateFlag = true;
                      this.router.navigate(['./consultation/waiting-doctor']);
                    }
                  });

                  if (this.check_for_free_doctor == 60) {
                    clearInterval(this.interval);
                    clearInterval(this.before_waiting_time_interval);
                    this.null_time_text = 'Свободного доктора сейчас нет, попробуйте позже пожалуйста.';

                    this.referenceService.deleteAppointment(this.req_id).subscribe(response => {
                      this.canDeactivateFlag = true;
                      this.router.navigate(['./main']);
                    });
                  }
                  this.check_for_free_doctor++;
                }
              }, 5 * 1000);
            }
            else {
              this.referenceService.getInfoAppointment(response['appointment_id']).subscribe(response => {
                console.log('estimated_meeting_start_countdown for waiting time component', response['estimated_meeting_start_countdown']);
                localStorage.setItem('start_time', response['estimated_meeting_start_countdown']);
              });
              this.canDeactivateFlag = true;
              this.router.navigate(['./consultation/waiting-doctor']);
            }
          });
        }

      }, this.waiting_time * 1000);
    }
    else {
      console.log('heta ekel waitingic');
      //get request_id from local storage
      this.req_id = localStorage.getItem('req_id');
      this.wrong_routing_modal_message = 'Ваша заявка удалена';
      this.referenceService.deleteAppointment(this.req_id).subscribe(response => {

        $('#wrong_routing_modal').on('hidden.bs.modal', () => {
          console.log('heta ekel waitingic jnjum enq');
          this.canDeactivateFlag = true;
          this.router.navigate(['./main']);
        });

        $('#wrong_routing_modal').modal('toggle');
        setTimeout(() => {
          $('#wrong_routing_modal').modal('hide');
        }, 5000);
      });
    }
  }

  ngOnDestroy() {
    console.log('destroy function');
    this.cancel_interval = false;
    window.clearInterval(this.interval);
    clearInterval(this.before_waiting_time_interval);
    clearTimeout(this.timer);
  }

  radioChecked() {
    console.log(this.selectedDock.id);
  }

  cancelCall() {
    console.log('cleared');
    console.log(this.interval);
    this.cancel_interval = false;
    window.clearInterval(this.interval);
    clearInterval(this.before_waiting_time_interval);

    clearTimeout(this.timer);

    //get request_id from local storage
    this.req_id = localStorage.getItem('req_id');
    this.referenceService.deleteAppointment(this.req_id).subscribe(response => {
      this.canDeactivateFlag = true;
      this.router.navigate(['./main']);
    });

  }

  getTimer(sec) {
    var myTimer = setInterval(() => {
      if (sec > 0) {
        sec--;
        if (sec < 60) {
          this.show_waiting_time = sec + ' сек.';
        } else {
          this.show_waiting_time = Math.floor(sec / 60) + ' мин. ' + sec % 60 + ' сек.';
        }
      } else {

        clearInterval(myTimer);
      }
    }, 1000);
  }

  canDeactivate (): Observable<boolean> | boolean {

    if (this.canDeactivateFlag) {
      return true;
    }

    const data: IDialogData = {
      title: 'Подтверждение действия',
      text: `
        Вы пытаетесь покинуть страницу!
        В случае подтверждения вашего действия ваша завка будет отменена
      `
    };

    return DialogComponent.createModalAndGetResult(data, this.dialog);
  }
}
