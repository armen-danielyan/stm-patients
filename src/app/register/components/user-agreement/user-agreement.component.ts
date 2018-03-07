import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../../shared/services/user-login.service.';
import { UserRegistrationService } from '../../../shared/services/user-registration.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CognitoUtil } from '../../../shared/services/cognito.service';
import { GuardService } from '../../../shared/services/guard.service';
import { UserAggrService } from '../../../shared/services/user-aggr.service';
import { ProfileApiService } from '../../../shared/services/profile-api.service';


@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.scss'],
  providers: [UserLoginService]
})
export class UserAgreementComponent implements OnInit {

  check: boolean = true;
  checkboxes = {
    username: '',
    service_rules: false,
    privacy_policy: false,
    dr_smart_isnt_health_facility: false,
    personal_data: false
  };


  password: string;
  phone_number: string;
  errorMessage = '';
  service_rules_html;
  privacy_policy_html;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private router: Router,
              public userRegistration: UserRegistrationService,
              public userService: UserLoginService,
              private http: HttpClient,
              public cUtil: CognitoUtil,
              private guardServ: GuardService,
              private userAggr: UserAggrService,
              private profileApi: ProfileApiService) {

    this.guardServ.nav_footer.footer_show = false;
  }

  ngOnInit() {

    this.userAggr.getServiceRules().subscribe(response => {
      this.service_rules_html = response['text'];
      console.log(this.service_rules_html);
    });
    this.userAggr.getPrivacyPolicy().subscribe(response => {
      this.privacy_policy_html = response['text'];
      console.log(this.privacy_policy_html);
    });

    this.password = this.userRegistration.password_global;
    this.phone_number = this.userRegistration.phone_global;

    console.log(this.password);
    console.log(this.phone_number);

    this.userService.authenticate(this.phone_number, this.password, this);
  }

  redirectRegister() {


    console.log(this.cUtil.getCurrentUser().username);
    this.checkboxes.username = this.cUtil.getCurrentUser().getUsername();

    this.router.navigate(['./personal-data']);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
    } else { //success
      this.profileApi.checkOrLogout();
      console.log('Redirect to ControlPanelComponent2');
      localStorage.setItem('isloggedin', 'true');
      localStorage.setItem('personal_data_page', 'true');
      localStorage.setItem('register-step-1', 'true');
      localStorage.setItem('register-step-2', 'true');


    }
  }

  check1(event) {
    this.checkboxes.service_rules = event.target.checked;
    console.log(event.target.checked);
  }

  check2(event) {
    this.checkboxes.privacy_policy = event.target.checked;
    console.log(event.target.checked);
  }

  check3(event) {
    this.checkboxes.dr_smart_isnt_health_facility = event.target.checked;
    console.log(event.target.checked);
  }

  check4(event) {
    this.checkboxes.personal_data = event.target.checked;
    console.log(event.target.checked);
  }
}
