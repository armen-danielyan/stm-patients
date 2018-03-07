import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import {
  CognitoCallback,
  LoggedInCallback,
  CognitoUtil
} from '../shared/services/cognito.service';

import { UserRegistrationService } from '../shared/services/user-registration.service';
import { UserLoginService } from '../shared/services/user-login.service.';
import { ProfileApiService } from '../shared/services/profile-api.service';
import { LocationService } from '../shared/services/location/location.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  providers: [UserLoginService]
})
export class LoginComponent implements CognitoCallback, LoggedInCallback {
  errorMessage = '';
  phone_number: string;
  password: string;
  mask: any[] = ['+', /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];


  constructor(
    private locationService: LocationService,
    private router: Router,
    public userService: UserLoginService,
    public registerService: UserRegistrationService,
    public cUtil: CognitoUtil,
    private profileApi: ProfileApiService
  ) {
    console.log(window.localStorage);
    localStorage.setItem('register-step-1', 'false');
    localStorage.setItem('register-step-2', 'false');
    console.log('commit new personal view 3');

    this.locationService.getCurrentLocation()
      .subscribe( currentCountry => {
        console.log( '\n Current Country + Phone Code \n', currentCountry );
        this.phone_number = currentCountry.dialCode + '';
      });
  }


  redirectUserAgreement() {
    this.router.navigate(['./register']);
  }

  signMeIn(form: NgForm) {

    if (form.invalid) {
      return false;
    }

    form.value.phone_number = form.value.phone_number.split('(').join('').split(')').join('').split('-').join('').split(' ').join('');
    console.log(form.value.phone_number);
    console.log('in onLogin');
    if (form.value.phone_number == null || form.value.password == null) {
      this.errorMessage = 'loggin inputs null';
      return;
    }
    this.registerService.isloginpassword_global = form.value.password;
    console.log(this.registerService.isloginpassword_global);
    this.userService.authenticate(form.value.phone_number, form.value.password, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
      console.log(this.errorMessage);
    } else { //success
      console.log('Redirect to ControlPanelComponent2');
      localStorage.setItem('isloggedin', 'true');
      localStorage.setItem('personal_data_page', 'true');
      localStorage.setItem('register-step-1', 'true');
      localStorage.setItem('register-step-2', 'true');

      this.profileApi.checkProfileData().subscribe(response => {
        console.log(response);
        if(response['name'] && response['name']=='error'){
          this.router.navigate(['./personal-data']);
        }
        else{
          localStorage.setItem('personal-data-verification','true');
          this.router.navigate(['./main']);
        }
      });
    }
  }

  isLoggedInCallback(message: string, isLoggedIn: boolean) {
    console.log('The user is logged in: ' + isLoggedIn + 'adda');
  }

  forgotPass() {
    localStorage.setItem('reset-password', 'true');
    this.router.navigate(['./reset-password/phone']);
  }

}
