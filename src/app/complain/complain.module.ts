import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AuthGuard } from '../guard/auth.guard';
import { ComplainComponent } from './complain.component';

const routes: Routes = [
  {
    path: '',
    component: ComplainComponent,
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
    ComplainComponent
  ],
  providers: []
})

export class ComplainModule {
}
