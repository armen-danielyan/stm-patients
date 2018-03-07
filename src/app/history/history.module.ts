import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { HistoryComponent } from './history.component';
import { AuthGuard } from '../guard/auth.guard';
import { HistoryConsultationComponent } from './components/consultation/history-consultation.component';

const routes: Routes = [
  {
    path: '',
    component: HistoryComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: ':id',
    component: HistoryConsultationComponent,
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
    HistoryComponent,
    HistoryConsultationComponent
  ],
  providers: []
})

export class HistoryModule {
}
