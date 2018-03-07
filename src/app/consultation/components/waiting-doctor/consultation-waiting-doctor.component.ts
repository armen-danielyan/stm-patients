import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuardService } from '../../../shared/services/guard.service';
import { ReferencesService } from '../../services/references.service';
import { HistoryService } from '../../../shared/services/history.service';
import { VideoChatService } from '../../services/video-chat.service';
import { ProfileApiService } from '../../../shared/services/profile-api.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { DialogComponent, IDialogData } from '../../../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { ICanDeactivateComponent } from '../../../guard/can-deactivate-dialog.guard';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-waiting-doctor',
  templateUrl: './consultation-waiting-doctor.component.html',
  styleUrls: ['./consultation-waiting-doctor.component.scss']
})
export class ConsultationWaitingDoctorComponent implements OnInit, ICanDeactivateComponent {

  private providerS3: any = environment.aws.s3.provider;

  room_id;
  req_id;
  docor_id;
  first_name;
  last_name;
  mid_name;
  doctor_spec;
  doctor_img = '';
  timer;
  waiting_time;
  show_waiting_time;
  temp_time;
  meeting_start_time;
  interval;
  timeout;
  wrong_routing_modal_message;
  loading: boolean = true;

  private canDeactivateFlag = false;

  constructor(private router: Router,
              private guardServ: GuardService,
              private referenceService: ReferencesService,
              private historyService: HistoryService,
              public videoService: VideoChatService,
              private profileApi: ProfileApiService,
              private dialog: MatDialog) {
    this.profileApi.checkOrLogout();
    this.guardServ.nav_footer.footer_show = false;
    console.log(window);
  }

  ngOnInit() {
    localStorage.setItem('page2', 'true');
    if (localStorage.getItem('page3') !== 'true') {
      this.waiting_time = localStorage.getItem('start_time');
      // this.waiting_time = 2;
      console.log('waiting time for waiting doctor component', this.waiting_time);

      //waiting time ui start
      // this.waiting_time = null
      if (this.waiting_time == null) {
        console.log('aaaa');
        this.waiting_time = 61;
      }

      this.getTimer(parseInt(this.waiting_time));


      //waiting time ui end


      this.req_id = localStorage.getItem('req_id');
      console.log('request_id = ', this.req_id);

      //get doctor info
      // get appointment_id by request_id
      this.referenceService.getAppointmentId(this.req_id).subscribe(response => {
        localStorage.setItem('app_id', response['appointment_id']);
        //get info about appointment
        this.referenceService.getInfoAppointment(response['appointment_id']).subscribe(response => {
          //doctor info start
          this.doctor_spec = response['doctor']['specialty']['caption_key'];
          this.docor_id = {
            'ids': response['doctor']['doctor_id']
          };
          this.doctor_img = `https://s3.${this.providerS3.region}.amazonaws.com/${this.providerS3.bucket}/` + response['doctor']['doctor_id'] + '/avatar.jpeg';
          this.historyService.getDoctorInfo(this.docor_id).subscribe(response => {
            console.log(response[0]);
            this.first_name = response[0]['first_name'];
            this.last_name = response[0]['last_name'];
            this.mid_name = response[0]['mid_name'];
            this.loading = false;
          });
          // doctor info end
        });
      });
      // get doctor info

      this.timeout = setInterval(() => {
        console.log('request_id = ', this.req_id);
        this.referenceService.getAppointmentId(this.req_id).subscribe(response => {
          this.room_id = response['appointment_id'];
          this.referenceService.getInfoAppointment(this.room_id).subscribe(response => {
            console.log(response['status']);
            this.meeting_start_time = response['meeting_start_time'];
            if (response['status'] == 'in progress') {
              console.log('Force start');
              this.referenceService.joinAppointment(this.room_id).subscribe(response => {
                this.canDeactivateFlag = true;
                clearInterval(this.timeout);
                this.router.navigate(['./consultation/call'], { queryParams: { room: this.room_id } });
              });
            }
            else {
              if (this.waiting_time < 1)
              {
                this.show_waiting_time = 'Ожидание';
                console.log('2');

                this.referenceService.joinAppointment(this.room_id).subscribe(response => {
                  clearInterval(this.timeout);
                  clearInterval(this.interval);
                  this.canDeactivateFlag = true;
                  this.router.navigate(['./consultation/call'], { queryParams: { room: this.room_id } });
                });
              }


            }

          });
        });
      }, 5 * 1000);


  } else {
  console.log('heta ekel callic');
  // finish appointment
  this.room_id = localStorage.getItem('app_id');
  this.wrong_routing_modal_message = 'Ваш вызов прерван';
  this.referenceService.finishAppointment(this.room_id).subscribe(response => {

    $('#wrong_routing_modal').on('hidden.bs.modal', () => {
      console.log(response);
      this.videoService.live_room();
      this.canDeactivateFlag = true;
      this.router.navigate(['./consultation/end']);
    });
        $('#wrong_routing_modal').on('hidden.bs.modal', () => {
          console.log(response);
          this.videoService.live_room();
          this.canDeactivateFlag = true;
          this.router.navigate(['./consultation/end']);
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
  window.clearInterval(this.interval);

  clearTimeout(this.timer);
  clearTimeout(this.timeout);
}

cancelCall() {
  clearTimeout(this.timer);

    // get request_id from local storage
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
      this.waiting_time = sec;
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
