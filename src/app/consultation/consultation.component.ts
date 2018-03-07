import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil } from '../shared/services/cognito.service';
import { GuardService } from '../shared/services/guard.service';
import { ReferencesService } from './services/references.service';
import { ProfileApiService } from '../shared/services/profile-api.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.scss']
})
export class ConsultationComponent implements OnInit {

  patient_id: string = this.cUtil.getCurrentUser().username;
  language_id: number = 1;
  message;
  messageStatus: boolean = false;
  selectedDock;


  anonim = false;

  profName: string;
  profId: string;
  proffesion;
  enabledDockCategory;
  disabledDockCategory;
  waiting_time;
  service_rules_html = 'some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text some text ';
  call_start_message;
  check2: boolean = false;
  check1: boolean = false;
  formData = new FormData();
  req_id;
  check_rank_disabled: boolean = false;
  wrong_routing_modal_message;

  constructor(private router: Router,
              public cUtil: CognitoUtil,
              private guardServ: GuardService,
              private referenceService: ReferencesService,
              private profileApi: ProfileApiService) {
    this.profileApi.checkOrLogout();
  }

  ngOnInit() {
    if (localStorage.getItem('page1') !== 'true') {
      this.guardServ.nav_footer.footer_show = false;
      const id = localStorage.getItem('speciality_id');
      console.log('speciality_id --------------------------------');
      console.log(id);
      //get proffessions list
      this.referenceService.getSpecialities(id).subscribe(response => {
        console.log(response);

        this.proffesion = response;
        // this.profName = this.proffesion[0].caption;
        this.profName = 'Выберите из списка';
      });

      //get ranks list
      this.referenceService.getRanks().subscribe((response: [any]) => {
        console.log(response);
        this.enabledDockCategory = response.filter(item => item.disabled == false);
        this.disabledDockCategory = response.filter(item => item.disabled == true);
      });
    } else {
      console.log('heta ekel waitingic');
      //get request_id from local storage
      this.req_id = localStorage.getItem('req_id');
      this.wrong_routing_modal_message = 'Ваша заявка удалена';
      this.referenceService.deleteAppointment(this.req_id).subscribe(response => {

        $('#wrong_routing_modal').on('hidden.bs.modal', () => {
          console.log('heta ekel cons callingic');
          this.router.navigate(['./main']);
        });

        $('#wrong_routing_modal').modal('toggle');
        setTimeout(() => {
          $('#wrong_routing_modal').modal('hide');
        }, 5000);
      });

    }
  }

  doctor(docProff) {
    this.profName = docProff.caption_key;
    this.profId = docProff.id;
    this.check1 = true;
  }

  checkCategory() {
    this.check2 = true;
  }

  checkMessage() {
    if (!this.message) {
      this.messageStatus = true;
    } else {
      this.messageStatus = false;
    }
  }
  redirectConsultingCalling() {
    this.formData.append('message', this.message);
    this.formData.append('patient_id', this.patient_id);
    this.formData.append('language_id', '1');
    this.formData.append('doctor_specialty_id', this.profId);
    this.formData.append('doctor_rank_id', this.selectedDock.id);
    this.referenceService.checked_doctor_rank = this.profName;

    // submit form(start consultation)
    this.referenceService.submitData(this.formData).subscribe(response => {
      this.waiting_time = response['searching_for_doctor_estimated_countdown'];

      console.log('waiting time (searching_for_doctor_estimated_countdown): ', this.waiting_time, ' - consultation component');
      if (response['id']) {
        localStorage.setItem('req_id', response['id']);
        console.log('request_id = ', response['id']);
      }
      if (this.waiting_time !== -1 && this.waiting_time !== 0) {
        console.log('miangamic');
        localStorage.setItem('waiting_time', this.waiting_time);
        this.router.navigate(['./consultation/calling']);
      } else if (this.waiting_time == 0) {
        localStorage.setItem('waiting_time', '0');
        this.call_start_message = 'Ваша очередь';
        $('#call-start').on('hidden.bs.modal', () => {
          console.log('Ваша очередь');
          this.router.navigate(['./consultation/calling']);
        });

        $('#call-start').modal('toggle');
        setTimeout(() => {
          $('#call-start').modal('hide');
        }, 2000);
      } else {
        this.call_start_message = 'Свободного доктора сейчас нет';
        $('#call-start').modal('toggle');
        console.log('Свободного доктора сейчас нет');
      }
    });
  }

}
