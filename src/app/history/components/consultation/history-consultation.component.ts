import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuardService } from '../../../shared/services/guard.service';
import { HistoryService } from '../../../shared/services/history.service';
import { ProfileApiService } from '../../../shared/services/profile-api.service';
import { environment } from '../../../../environments/environment';



declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-history-consultation',
  templateUrl: './history-consultation.component.html',
  styleUrls: ['./history-consultation.component.scss']
})
export class HistoryConsultationComponent implements OnInit {
  private providerS3: any = environment.aws.s3.provider;
  starVal: number;
  history: any = {};
  epicrisis_text;
  epicrisis_pdf;
  documents;
  doctor_first_name;
  doctor_last_name;
  doctor_mid_name;
  doctor_photo = '';
  doctor_speciality;
  video_src;
  docor_id;

  no_epcrisis: boolean = false;
  historyID;
  loading: boolean = true;

  constructor(private router: Router,
              private guardServ: GuardService,
              private historyService: HistoryService,
              private profileApi: ProfileApiService) {
    this.profileApi.checkOrLogout();
    this.guardServ.nav_footer.footer_show = false;
  }

  ngOnInit() {
    $('.rateyo').rateYo();
    this.historyID = location.pathname.split('/')[2];
    this.historyService.getHistoryConsultation(this.historyID).subscribe(consultation => {
        this.history = consultation;
        if (consultation.epicrisis) {
          this.epicrisis_pdf = consultation.epicrisis.pdf;
        }

        this.docor_id = {
          'ids':consultation.doctor.doctor_id
        };
        this.historyService.getDoctorInfo(this.docor_id).subscribe(doctor => {
          console.log(doctor[0]);
          this.doctor_photo = `https://s3.${this.providerS3.region}.amazonaws.com/${this.providerS3.bucket}/${doctor[0].sub}/avatar.jpeg`;
          this.doctor_first_name = doctor[0].first_name;
          this.doctor_last_name = doctor[0].last_name;
          this.doctor_mid_name = doctor[0].mid_name;
          localStorage.setItem('doctor_pers_info',this.doctor_first_name + ' ' + this.doctor_last_name + ' ' + this.doctor_mid_name);
          this.loading = false;
        });
    });

  }

  ngAfterViewInit() {
  }

  redirectComplain() {
    this.router.navigate(['./complain']);
  }

  clickStars() {
    this.starVal = $('.rateyo').rateYo('option', 'rating');
    console.log(this.starVal);
  }

  correctTime(sec_num) {
    var hours;
    var minutes;
    var seconds;
    hours = Math.floor(sec_num / 3600);
    minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours == 0) {
      hours = '';
    } else {
      hours = hours + ' час ';
    }

    if (minutes == 0) {
      minutes = '';
    } else {
      minutes = minutes + ' мин ';
    }

    if (seconds == 0) {
      seconds = '';
    } else {
      seconds = seconds + ' сек';
    }

    var result = hours + minutes + seconds;

    return result != '' ? result : 'false';
  }

}
