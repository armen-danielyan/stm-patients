import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guard/auth.guard';

import { ChangeNumberComponent } from './components/number/number.component';
import { ChangeNumberConfirmComponent } from './components/number-confirm/number-confirm.component';
import { ChangePasswordComponent } from './components/password/password.component';

const routes: Routes = [
  {
    path: 'number',
    component: ChangeNumberComponent
  },
  { path: 'number/confirm',
    component: ChangeNumberConfirmComponent,
    canActivate: [ AuthGuard ]
  },
  { path: 'password',
    component: ChangePasswordComponent,
    canActivate: [ AuthGuard ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [],
  declarations: [
    ChangeNumberComponent,
    ChangeNumberConfirmComponent,
    ChangePasswordComponent
  ],
  providers: [],
})
export class ChangeModule {
}
