import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { GuardService } from '../../../shared/services/guard.service';

import { CognitoCallback, RegistrationUser } from '../../../shared/services/cognito.service';
import { UserRegistrationService } from '../../../shared/services/user-registration.service';
import { UserLoginService } from '../../../shared/services/user-login.service.';
import { UserAggrService } from '../../../shared/services/user-aggr.service';


@Component({
  selector: 'app-register-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.sass'],
  providers: [UserLoginService]
})
export class RegisterConfirmComponent implements CognitoCallback {
  errorMessage = '';
  confirmationCode: string;
  phone: string;
  password: string;
  countDown;
  count_resend = 59;
  service_rules_html;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  mask: any[] = ['+', /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];

  constructor(public userRegistration: UserRegistrationService,
              private router: Router,
              private guardServ: GuardService,
              private userAggr: UserAggrService) {


    this.guardServ.nav_footer.footer_show = false;
    console.log('Entered ConfirmRegistrationComponent');
    this.phone = localStorage.getItem('phone_number');
    this.phone = this.userRegistration.phone_global;
    console.log(this.phone);

  }

  ngOnInit() {

    this.userAggr.getServiceRules().subscribe(response => {
      this.service_rules_html = response['text'];
      console.log(this.service_rules_html);
    });

    this.countDown = Observable.timer(0, 1000)
      .take(this.count_resend)
      .map(() => --this.count_resend);
  }

  changeNumber() {
    this.router.navigate(['./change/number']);
  }

  onConfirmRegistration(form: NgForm) {
    console.log(this.phone, '', this.confirmationCode);
    this.userRegistration.confirmRegistration(this.phone, this.confirmationCode, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
    } else { //success
      localStorage.setItem('phone_number', this.userRegistration.phone_global);
      console.log('Entered ConfirmRegistrationComponent');
      if (this.phone != null) {
        localStorage.setItem('isloggedin', 'true');
        localStorage.setItem('register-step-2', 'true');
        this.router.navigate(['./register/user-agreement']);
      }
    }
  }


  resendCode() {
    this.count_resend = 59;
    this.userRegistration.resendCodeRegister(this.phone);
    this.countDown = Observable.timer(0, 1000)
      .take(this.count_resend)
      .map(() => --this.count_resend);
    this.confirmationCode = '';
  }
}
