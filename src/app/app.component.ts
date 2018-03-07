import { Component } from '@angular/core';
import { UserRegistrationService } from './shared/services/user-registration.service';
import { RefreshGuardService } from './shared/services/refresh-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.sass' ],
  providers: [ UserRegistrationService ]
})
export class AppComponent {

  constructor(private refreshGuardService: RefreshGuardService) {
    refreshGuardService.addListener();
  }

}
