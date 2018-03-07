import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegistrationService } from '../../../shared/services/user-registration.service';
import { CognitoCallback, RegistrationUser } from '../../../shared/services/cognito.service';
import { GuardService } from '../../../shared/services/guard.service';
import { NgForm } from '@angular/forms';
import { ProfileApiService } from '../../../shared/services/profile-api.service';

@Component({
  selector: 'app-change-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.sass']
})
export class ChangeNumberComponent implements CognitoCallback {
  errorMessage = '';
  registrationUser: RegistrationUser;
  new_phone_number: string;
  old_phone_number: string = this.userRegistration.phone_global;
  mask: any[] = ['+', /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];

  constructor(public userRegistration: UserRegistrationService,
              private router: Router,
              private guardServ: GuardService,
              private profileApi: ProfileApiService) {
    this.profileApi.checkOrLogout();
  }

  ngOnInit() {
    this.guardServ.nav_footer.footer_show = false;
    this.registrationUser = new RegistrationUser();


    this.registrationUser.email = this.userRegistration.email_global;


    this.registrationUser.password = this.userRegistration.password_global;


    this.registrationUser.phone_number = this.userRegistration.phone_global;

  }

  onRegister(form: NgForm) {
    this.userRegistration.phone_global = this.new_phone_number.split('(').join('').split(')').join('').split('-').join('').split(' ').join('');

    this.registrationUser.phone_number = this.userRegistration.phone_global;

    this.userRegistration.register(this.registrationUser, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
    } else { // success
      this.router.navigate(['./register-step-2']);
      this.registrationUser.phone_number = this.userRegistration.phone_global;
      localStorage.setItem('register-step-2', 'true');
      console.log('in callback...result: ' + result);
    }
  }

}
