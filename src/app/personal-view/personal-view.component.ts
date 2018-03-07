import { Component, OnInit } from '@angular/core';
import { CognitoCallback, CognitoUtil, LoggedInCallback } from '../shared/services/cognito.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileApiService } from '../shared/services/profile-api.service';
import { UserLoginService } from '../shared/services/user-login.service.';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile-view',
  templateUrl: './personal-view.component.html',
  styleUrls: ['./personal-view.component.scss']
})
export class PersonalViewComponent implements OnInit {

  avatar: string;
  number: string;
  headers;
  information = {};
  allergies: string;
  illness: string;
  date;
  age;
  show_alergy_block: boolean = false;
  show_illness_block: boolean = false;
  year;

  constructor(
    private cUtil: CognitoUtil,
    private http: HttpClient,
    private profileApi: ProfileApiService,
    public userService: UserLoginService,
    private router: Router
  ) {
    this.profileApi.checkOrLogout();
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      this.headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());
    });
  }

  ngOnInit() {
    this.avatar = this.cUtil.getCurrentUser().getUsername() + '/' + 'avatar.jpeg';
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      if (err) {
        alert(err);
        return;
      }
      this.number = session.getIdToken().payload.phone_number;
    });
    !cognitoUser && this.router.navigate(['/login']);

    // check user exists and receive data
    this.profileApi.checkProfileData().subscribe(response => {
      if (response['name'] && response['name'] == 'error') {
      }
      else {
        this.information = response;
        this.allergies = JSON.parse(this.information['allergies']);
        this.illness = JSON.parse(this.information['chronic_diseases']);
        this.date = this.information['birth_date'];
        this.age = this.calculateAge(new Date(this.date));
        this.getYearWord(this.age);
        if (this.allergies.length > 0) {
          this.show_alergy_block = true;
        }
        if (this.illness.length > 0) {
          this.show_illness_block = true;
        }
        console.log(this.allergies.length);
        console.log(this.illness.length);
      }
    });

  }

  calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  logoutUser() {
    this.userService.logout();
    localStorage.setItem('isloggedin', 'false');
    localStorage.setItem('personal_data_page', 'false');
    localStorage.setItem('phone_number', '');
    localStorage.setItem('register-step-1', 'false');
    localStorage.setItem('register-step-2', 'false');
    localStorage.setItem('register-step-3', 'false');
    localStorage.clear();
    console.log('logouted');
    this.router.navigate(['./login']);
  }

  getYearWord(age) {
    if (age == 11 || age == 12 || age == 13 || age == 14) {
      return this.year = 'лет';
    }
    else if (age == 1 || age % 10 == 1) {
      return this.year = 'год';
    }
    else if (age == 2 || age == 3 || age == 4 || age % 10 == 2 || age % 10 == 3 || age % 10 == 4) {
      return this.year = 'годa';
    }
    else if (age == 5 || age == 6 || age == 7 || age == 8 || age == 9 || age % 10 == 0 || age % 10 == 5 || age % 10 == 6 || age % 10 == 7 || age % 10 == 8 || age % 10 == 9) {
      return this.year = 'лет';
    }
  }
}
