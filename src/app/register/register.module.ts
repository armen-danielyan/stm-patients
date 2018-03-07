import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { RegisterComponent } from './register.component';
import { RegisterConfirmComponent } from './components/confirm/confirm.component';
import { RegisterGuard } from './guards/register.guard';
import { RegisterStep2Guard } from './guards/register-step-2.guard';
import { PersonalDataGuard } from '../guard/personal-data.guard';
import { UserAgreementComponent } from './components/user-agreement/user-agreement.component';
import { AuthGuard } from '../guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    canActivate: [ RegisterStep2Guard, PersonalDataGuard ]
  },
  { path: 'confirm',
    component: RegisterConfirmComponent,
    canActivate: [ RegisterGuard, PersonalDataGuard ]
  },
  { path: 'user-agreement',
    component: UserAgreementComponent,
    canActivate: [ AuthGuard ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ],
  declarations: [
    RegisterComponent,
    RegisterConfirmComponent,
    UserAgreementComponent
  ],
  providers: [
    RegisterGuard,
    RegisterStep2Guard
  ]
})

export class RegisterModule {
}
