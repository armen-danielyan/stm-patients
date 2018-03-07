import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AuthGuard } from '../guard/auth.guard';
import { PersonalDataComponent } from './personal-data.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalDataComponent,
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
    PersonalDataComponent
  ],
  providers: []
})

export class PersonalDataModule {
}
