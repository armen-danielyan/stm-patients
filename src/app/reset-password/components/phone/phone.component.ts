import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegistrationService } from '../../../shared/services/user-registration.service';

import { GuardService } from '../../../shared/services/guard.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset-password-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class ResetPasswordPhoneComponent implements OnInit {
  username: string;
  errorMessage = '';
  mask: any[] = ['+', /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];

  constructor(private router: Router,
              public registerService: UserRegistrationService,
              private guardServ: GuardService) {
    this.guardServ.nav_footer.footer_show = false;
  }

  ngOnInit() {
  }

  onReset(form: NgForm) {
    this.username = this.username.split('(').join('').split(')').join('').split('-').join('').split(' ').join('');

    this.registerService.forgotpass1(this.username, (data, navigate) => {

      this.registerService.reset_phone_number = this.username;
      console.log(this.registerService.navigate);
      console.log('component : navigate ');
      if (navigate) {
        this.router.navigate(['./reset-password/confirm']);
      }

      console.log(this.username);
    });
  }

}
