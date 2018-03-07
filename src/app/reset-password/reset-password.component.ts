import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuardService } from '../shared/services/guard.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  errorMessage = '';
  new_password: string;
  page: string;

  constructor(private router: Router,
              private guardServ: GuardService) {
    this.guardServ.nav_footer.footer_show = false;
  }

  ngOnInit() {
  }

  forgot_reset_password() {
    this.router.navigate(['./reset-password/phone']);

  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
    } else { //success
      localStorage.setItem('isloggedin', 'true');
      localStorage.setItem('personal_data_page', 'true');
      localStorage.setItem('register-step-1', 'true');
      localStorage.setItem('register-step-2', 'true');
      localStorage.setItem('register-step-3', 'true');

      this.router.navigate(['./personal-data']);

    }
  }

}
