import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegistrationService } from '../../../shared/services/user-registration.service';
import { UserAggrService } from '../../../shared/services/user-aggr.service';
import { GuardService } from '../../../shared/services/guard.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';


@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})


export class ResetPasswordConfirmComponent implements OnInit {
  errorMessage = '';
  confirmationCode: string;
  phone: string;
  new_pass: string;
  countDown;
  count_resend = 59;
  type = 'password';
  service_rules_html;

  mask: any[] = ['+', /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];


  constructor(private router: Router,
              public registerService: UserRegistrationService,
              private guardServ: GuardService,
              public userRegistration: UserRegistrationService,
              private userAggr: UserAggrService) {

    this.guardServ.nav_footer.footer_show = false;
  }

  ngOnInit() {

    this.userAggr.getServiceRules().subscribe(response => {
      this.service_rules_html = response['text'];
      console.log(this.service_rules_html);
    });

    this.phone = this.registerService.reset_phone_number;

    this.countDown = Observable.timer(0, 1000)
      .take(this.count_resend)
      .map(() => --this.count_resend);
  }

  onConfirmRegistration() {
    this.registerService.confirmnewpass(this.phone, this.confirmationCode, this.new_pass, this);

  }

  cognitoCallback(message: string, result: any) {
    if (message != null) {
      this.errorMessage = message;
      return;
    } else {
      console.log('success');
      this.router.navigate(['./login']);
    }
  }


  resendCode() {
    this.count_resend = 59;
    this.registerService.forgotpass(this.phone);
    this.countDown = Observable.timer(0, 1000)
      .take(this.count_resend)
      .map(() => --this.count_resend);
    this.confirmationCode = '';
  }

  typeInpShow() {
    this.type = 'string';
  }

  typeInpHiden() {
    this.type = 'password';

  }

}
