import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScriptLoaderService } from '../../../shared/services/script-loader.service';
import { GuardService } from '../../../shared/services/guard.service';
import { ProfileApiService } from '../../../shared/services/profile-api.service';

@Component({
  selector: 'app-consultation-prep',
  templateUrl: './consultation-prep.component.html',
  styleUrls: ['./consultation-prep.component.scss']
})
export class ConsultationPrepComponent implements OnInit, OnDestroy {


  play = true;
  pause = false;
  privacy_policy_html = 'Text Text Text Text Text Text Text Text Text Text Text Text';

  constructor(private router: Router,
              private _script: ScriptLoaderService,
              private guardServ: GuardService,
              private profileApi: ProfileApiService) {
    this.profileApi.checkOrLogout();
    this.guardServ.nav_footer.footer_show = false;
  }

  ngOnInit() {
    this._script.load('app-consultation-prep',
      'assets/js/prep/main.js', 'assets/js/prep/audio-widget.js', 'assets/js/prep/soundmeter.js');
    console.log('dadga');
  }

  ngAfterViewInit() {
  }

  redirectConsultation() {
    this.router.navigate(['./consultation']);
  }

  ngOnDestroy() {
    if (window['stream'] && window['stream'].getTracks()[0]) {
      window['stream'].getTracks()[0].stop();
    }
    if (window['stream'] && window['stream'].getTracks()[1]) {
      window['stream'].getTracks()[1].stop();
    }
  }


}

