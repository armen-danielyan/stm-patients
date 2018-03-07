import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AuthGuard } from '../guard/auth.guard';
import { PersonalViewComponent } from './personal-view.component';
import { PersonalViewGuard } from '../guard/personal-view.guard';

const routes: Routes = [
  {
    path: '',
    component: PersonalViewComponent,
    canActivate: [ AuthGuard, PersonalViewGuard ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ],
  declarations: [
    PersonalViewComponent
  ],
  providers: []
})

export class PersonalViewModule {
}
