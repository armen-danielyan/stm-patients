import { Component } from '@angular/core';
import { CognitoCallback } from '../../../shared/services/cognito.service';
import { Router } from '@angular/router';
import { UserRegistrationService } from '../../../shared/services/user-registration.service';
import { UserLoginService } from '../../../shared/services/user-login.service.';
import { GuardService } from '../../../shared/services/guard.service';
import { ProfileApiService } from '../../../shared/services/profile-api.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.sass'],
  providers: [UserLoginService]
})
export class ChangePasswordComponent implements CognitoCallback {
  oldpassword: string;
  newpassword: string;
  errorMessage = '';
  phone: string = localStorage.getItem('phone_number');
  type = 'password';
  typeOld = 'password';
  password_text;
  safePassword = false;
  progBar = 0;
  pass_class_1: boolean = false;
  pass_class_2: boolean = false;
  pass_class_3: boolean = false;

  constructor(public userRegistration: UserRegistrationService,
              private router: Router,
              public userService: UserLoginService,
              private guardServ: GuardService,
              private profileApi: ProfileApiService) {
    this.profileApi.checkOrLogout();
    this.guardServ.nav_footer.footer_show = false;
  }

  changePasswords() {
    this.userRegistration.changePassword(this.oldpassword, this.newpassword, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
    } else { //success
      this.userService.logout();
      this.router.navigate(['/login']);

      localStorage.setItem('isloggedin', 'false');
      localStorage.setItem('personal_data_page', 'false');
      localStorage.setItem('phone_number', '');
      localStorage.setItem('register-step-1', 'false');
      localStorage.setItem('register-step-2', 'false');
      localStorage.setItem('register-step-3', 'false');

    }
  }

  typeInpShow() {
    this.type = 'string';
  }

  typeInpHiden() {
    this.type = 'password';

  }

  typeInpShowOld() {
    this.typeOld = 'string';
  }

  typeInpHidenOld() {
    this.typeOld = 'password';

  }

  inputPassword() {
    this.safePassword = false;
    this.progBar = 0;
    if (this.newpassword.length >= 6) {
      this.safePassword = true;
      this.progBar = 20;
      this.checkProgbar(this.progBar);

      if (/[A-Z]/.test(this.newpassword)) {
        this.progBar = this.progBar + 20;
        this.checkProgbar(this.progBar);
      }
      if (/[0-9]/.test(this.newpassword)) {
        this.progBar = this.progBar + 20;
        this.checkProgbar(this.progBar);
      }
      if (/[@#$%]/.test(this.newpassword)) {
        this.progBar = this.progBar + 20;
        this.checkProgbar(this.progBar);
      }

      if (this.newpassword.length >= 8) {
        this.progBar = this.progBar + 20;
        this.checkProgbar(this.progBar);
      }

    }

  }

  checkProgbar(progBar) {
    if (progBar >= 20 && progBar <= 40) {
      this.password_text = 'Слабый пароль';
      this.pass_class_1 = true;
      this.pass_class_2 = false;
      this.pass_class_3 = false;
    }
    if (progBar > 40 && progBar <= 80) {
      this.password_text = 'Средний пароль';
      this.pass_class_1 = false;
      this.pass_class_2 = true;
      this.pass_class_3 = false;
    }
    if (progBar > 80) {
      this.password_text = 'Надёжный пароль';
      this.pass_class_1 = false;
      this.pass_class_2 = false;
      this.pass_class_3 = true;
    }
  }


}
