import { Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from '../shared/services/script-loader.service';
import { Router } from '@angular/router';
import { GuardService } from '../shared/services/guard.service';
import { ComplainService } from '../shared/services/complain.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  private baseUrl: string = environment.api.url;
  themes;
  themeText: string;
  theme_id: number;
  recaptcha_value: string;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private _script: ScriptLoaderService,
              private router: Router,
              private guardServ: GuardService,
              private complainService: ComplainService,
              // private referenceService: ReferencesService,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.guardServ.nav_footer.footer_show = false;
    console.log('captcha testing 2');
    this.http.get(`${this.baseUrl}/common/reference/complaint-subject`, {headers: this.headers}).subscribe(response => {
      this.themes = response;
      console.log(response);
      this.themeText = this.themes[0].caption;
    });
  }

  resolved(event) {
    console.log(event);
    this.recaptcha_value = event;
  }

  selectTheme(theme) {
    if (!theme) {
      this.themeText = this.themes[0].caption;
      this.theme_id = this.themes[0].id;
    } else {
      this.themeText = theme.caption;
      this.theme_id = theme.id;
    }
  }

  onSubmit(f) {
    if (this.recaptcha_value) {
      console.log(this.recaptcha_value);

      f.value.subject_id = this.theme_id;
      f.value.g_recaptcha_response = this.recaptcha_value;
      console.log(f.value);
      this.complainService.general_complain = f.value;
      this.complainService.submitComplainGeneral().subscribe(response => {
        console.log(response);
      });
      this.router.navigate(['./login']);

    } else {
      alert('Please resolve the captcha and submit!');
    }

  }

}
