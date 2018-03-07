import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordConfirmComponent } from './components/confirm/confirm.component';
import { ResetPasswordPhoneComponent } from './components/phone/phone.component';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent
  },
  {
    path: 'confirm',
    component: ResetPasswordConfirmComponent
  },
  {
    path: 'phone',
    component: ResetPasswordPhoneComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ],
  declarations: [
    ResetPasswordComponent,
    ResetPasswordConfirmComponent,
    ResetPasswordPhoneComponent
  ],
  providers: [
  ]
})

export class ResetPasswordModule {
}
