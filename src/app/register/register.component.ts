import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';

import {UserRegistrationService} from '../shared/services/user-registration.service';
import {RegistrationUser} from '../shared/services/cognito.service';
import {GuardService} from '../shared/services/guard.service';

import { LocationService } from '../shared/services/location/location.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})

export class RegisterComponent {
  errorMessage = '';
  registrationUser: RegistrationUser;
  type = 'password';
  safePassword = false;
  progBar = 0;
  mask: any[] = ['+', /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  pass_class_1: boolean = false;
  pass_class_2: boolean = false;
  pass_class_3: boolean = false;
  password_text;

  constructor(
    private locationService: LocationService,
    public userRegistration: UserRegistrationService,
    private router: Router,
    private guardServ: GuardService
  ) {
    this.registrationUser = new RegistrationUser();
    this.guardServ.nav_footer.footer_show = false;

    this.locationService.getCurrentLocation()
      .subscribe( currentCountry => {
        console.log( '\n Current Country + Phone Code \n', currentCountry );
        this.registrationUser.phone_number = currentCountry.dialCode + '';
      });
  }


  onRegister(form: NgForm) {

    if (form.invalid) {
      return false;
    }

    console.log(form);
    this.registrationUser.phone_number = form.value.phone.split('(').join('').split(')').join('').split('-').join('').split(' ').join('');
    console.log(this.registrationUser.phone_number);


    this.userRegistration.password_global = this.registrationUser.password;
    this.userRegistration.phone_global = this.registrationUser.phone_number;

    if (this.userRegistration.phone_global !== this.userRegistration.password_global) {
      this.userRegistration.register(this.registrationUser, this);
    } else {
      this.errorMessage = 'Логин и пароль не должны совпадать';
    }
  }

  ngOnInit() {
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      if (this.userRegistration.password_global.length < 6) {
        this.errorMessage = 'Пароль должен содержать минимум 6 символов';
        return;
      } else {
        console.log(message);
        this.errorMessage = message;
        console.log(this.errorMessage);
        console.log(this.userRegistration.phone_global);
      }

    } else { // success
      localStorage.setItem('register-step-1', 'true');
      this.router.navigate(['register/confirm']);
      console.log('in callback...result: ' + result);
    }
  }

  typeInpShow() {
    this.type = 'string';
  }

  typeInpHiden() {
    this.type = 'password';

  }


  inputPassword(value) {
    this.safePassword = false;
    this.progBar = 0;
    console.log(value.length);
    if (value.length >= 6) {
      this.safePassword = true;
      this.progBar = 20;
      this.checkProgbar(this.progBar);

      if (/[A-Z]/.test(value)) {
        this.progBar = this.progBar + 20;
        this.checkProgbar(this.progBar);
      }
      if (/[0-9]/.test(value)) {
        this.progBar = this.progBar + 20;
        this.checkProgbar(this.progBar);
      }
      if (/[@#$%]/.test(value)) {
        this.progBar = this.progBar + 20;
        this.checkProgbar(this.progBar);
      }

    }
    if (value.length >= 8) {
      this.progBar = this.progBar + 20;
      this.checkProgbar(this.progBar);
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
