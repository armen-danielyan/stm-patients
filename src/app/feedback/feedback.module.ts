import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';

import { SharedModule } from '../shared/shared.module';

import { AuthGuard } from '../guard/auth.guard';
import { FeedbackComponent } from './feedback.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbackComponent,
    canActivate: [ AuthGuard ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    RecaptchaModule.forRoot(), // Keep in mind the "forRoot"-magic nuances!
  ],
  exports: [ RouterModule ],
  declarations: [
    FeedbackComponent
  ],
  providers: []
})

export class FeedbackModule {
}
