import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuardService } from '../shared/services/guard.service';
import { ComplainService } from '../shared/services/complain.service';
import { ProfileApiService } from '../shared/services/profile-api.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-complain',
  templateUrl: './complain.component.html',
  styleUrls: ['./complain.component.scss']
})
export class ComplainComponent implements OnInit {
  reportMassage: string;
  subjectMessage = '';
  appointment_id;
  status: boolean = false;
  limited_text;
  history_time;
  doctor_pers_info;
  doctor_speciality;
  formData = new FormData();

  constructor(private router: Router,
              private guardServ: GuardService,
              private complainService: ComplainService,
              private profileApi: ProfileApiService) {
    this.profileApi.checkOrLogout();
  }

  ngOnInit() {
    this.appointment_id = localStorage.getItem('history_id');
    this.history_time = localStorage.getItem('history_time');

    this.doctor_pers_info = localStorage.getItem('doctor_pers_info');
    this.doctor_speciality = localStorage.getItem('doctor_speciality');


    this.guardServ.nav_footer.footer_show = false;
  }

  sendReport() {
    this.formData.append('appointment_id', this.appointment_id);

    this.formData.append('subject', this.subjectMessage);
    this.formData.append('message', this.reportMassage);

    this.complainService.submitComplain(this.formData).subscribe(response => {
      console.log(response);
      if (response['appointment_id'] == this.appointment_id) {
        this.router.navigate(['./main']);
      }
    });

  }
}
