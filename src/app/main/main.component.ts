import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GuardService } from '../shared/services/guard.service';
import { CognitoCallback, CognitoUtil, LoggedInCallback } from '../shared/services/cognito.service';
import { ProfileApiService } from '../shared/services/profile-api.service';
import { BadgesService } from '../shared/services/badges.service';
import { environment } from '../../environments/environment';


// declare let AWS: any;
declare let AWSCognito: any;
const albumBucketName = 'stm.patient';
const bucketRegion = 'us-east-2';
const AWS = window.AWS;
let delKey = null;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  private userS3: any = environment.aws.s3.user;
  private baseUrl: string = environment.api.url;
  headers;
  specializations;
  avatar = '';
  information = {};
  img_path;
  appointment_histories_ids = [];
  history_response;
  badgesCounts: any = {};

  constructor(private router: Router,
              private http: HttpClient,
              private guardServ: GuardService,
              public cUtil: CognitoUtil,
              private profileApi: ProfileApiService,
              private badgesService: BadgesService) {

    this.profileApi.checkOrLogout();

    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      this.headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());
    });
  }

  ngOnInit() {
    localStorage.setItem('page1', 'false');
    localStorage.setItem('page2', 'false');
    localStorage.setItem('page3', 'false');
    const cognitoUser = this.cUtil.getCurrentUser();
    this.avatar = `https://s3.${this.userS3.region}.amazonaws.com/${this.userS3.bucket}/${this.cUtil.getCurrentUser().getUsername()}/avatar.jpeg`;

    this.badgesService.getBadgesCounts().subscribe(data => {
      this.badgesCounts = data;
    });

    cognitoUser && cognitoUser.getSession((err, session) => {
      if (session.getIdToken().payload.phone_number_verified === false) {
        this.router.navigate(['./change/number/confirm']);
      }
    });
    this.guardServ.nav_footer.footer_show = false;


    this.http.get(`${this.baseUrl}/patient/core/reference/specialization?expand=1`, {headers: this.headers})
      .subscribe((res) => {
        console.log(res);
        this.specializations = res;
      });

    // check user exists and receive data
    this.profileApi.checkProfileData().subscribe(response => {
      if (response['name'] && response['name'] == 'error') {
      } else {
        console.log(this.information);
        this.information = response;
        console.log(this.information);
      }
    });
  }

  redirectConsultationPrep(id) {
    console.log(id);
    localStorage.setItem('speciality_id', id);
    this.router.navigate(['./consultation/prep']);

  }

  redirectPersonalData() {
    this.router.navigate(['./personal-view']);
  }

  redirectPayments() {
  }

  redirectHistoryConsultation() {
    this.router.navigate(['./history']);
  }

}
