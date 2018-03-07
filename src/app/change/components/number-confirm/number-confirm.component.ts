import { Component } from '@angular/core';
import { UserRegistrationService } from '../../../shared/services/user-registration.service';
import { CognitoCallback, CognitoUtil } from '../../../shared/services/cognito.service';
import { UserLoginService } from '../../../shared/services/user-login.service.';
import { GuardService } from '../../../shared/services/guard.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { ProfileApiService } from '../../../shared/services/profile-api.service';


@Component({
  selector: 'app-change-number-confirm',
  templateUrl: './number-confirm.component.html',
  styleUrls: ['./number-confirm.component.sass']
})
export class ChangeNumberConfirmComponent implements CognitoCallback {
  newphone = '';
  code = '';
  errorMessage = '';
  oldnumber = '';
  verifayCode = false;
  phoneverfikeshn = true;
  shownewphone = false;
  count = 30;
  countDown;
  count_resend = 0;
  start_timer: boolean = false;
  mask: any[] = ['+', /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];

  constructor(public userRegistration: UserRegistrationService, public cUtil: CognitoUtil, private guardServ: GuardService, private profileApi: ProfileApiService) {
    this.profileApi.checkOrLogout();
    this.guardServ.nav_footer.footer_show = false;
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      if (err) {
        alert(err);
        return;
      }
      this.oldnumber = session.getIdToken().payload.phone_number;
    });
  }

  ngOnInit() {
  }


  method(verifay) {
    console.log(verifay);
  }

  changePhone() {
    // start timer
    this.count_resend = 59;
    this.countDown = Observable.timer(0, 1000)
      .take(this.count_resend)
      .map(() => --this.count_resend);
    this.start_timer = true;

    this.newphone = this.newphone.split('(').join('').split(')').join('').split('-').join('').split(' ').join('');

    this.userRegistration.changeNumber(this.newphone, this);
    this.verifayCode = true;

    this.phoneverfikeshn = false;
    this.shownewphone = true;
  }

  VerificationCode() {
    this.userRegistration.VerificationCode(this.code, this);
  }

  show() {
    this.start_timer = false;
    this.count_resend = 0;
    this.shownewphone = false;
    this.phoneverfikeshn = true;
    this.verifayCode = false;

  }


  cognitoCallback(message: string, result: any) {
    if (message != null) { //error

      this.errorMessage = message;
    } else { //success
      this.verifayCode = true;
      this.phoneverfikeshn = false;
    }
  }

  resendCode() {
    this.count_resend = 59;
    this.countDown = Observable.timer(0, 1000)
      .take(this.count_resend)
      .map(() => --this.count_resend);

    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      if (err) {
        alert(err);
        return;
      }
      this.oldnumber = session.getIdToken().payload.phone_number;
      cognitoUser.getAttributeVerificationCode('phone_number', {
        onSuccess() {
          console.log('ok!');
        },
        onFailure(err) {
          console.log('error!');
        }
      });
    });
  }

}
