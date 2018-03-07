import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AuthGuard } from '../guard/auth.guard';
import { CanDeactivateDialogGuard } from '../guard/can-deactivate-dialog.guard';

import { ConsultationComponent } from './consultation.component';
import { ConsultationPrepComponent } from './components/prep/consultation-prep.component';
import { ConsultationWaitingDoctorComponent } from './components/waiting-doctor/consultation-waiting-doctor.component';
import { ConsultationCallingComponent } from './components/calling/consultation-calling.component';
import { ConsultationCallComponent } from './components/call/consultation-call.component';
import { ConsultationEndComponent } from './components/end/consultation-end.component';

import { SkylinkService } from './services/skylink.service';
import { ChatService } from './services/chat.service';
import { VideoChatService } from './services/video-chat.service';
import { ReferencesService } from './services/references.service';

const routes: Routes = [
  {
    path: '',
    component: ConsultationComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'prep',
    component: ConsultationPrepComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'calling',
    component: ConsultationCallingComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ CanDeactivateDialogGuard ]
  },
  {
    path: 'waiting-doctor',
    component: ConsultationWaitingDoctorComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ CanDeactivateDialogGuard ]
  },
  {
    path: 'call',
    component: ConsultationCallComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ CanDeactivateDialogGuard ]
  },
  {
    path: 'end',
    component: ConsultationEndComponent,
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
    ConsultationComponent,
    ConsultationPrepComponent,
    ConsultationWaitingDoctorComponent,
    ConsultationCallingComponent,
    ConsultationCallComponent,
    ConsultationEndComponent
  ],
  providers: [
    SkylinkService,
    ChatService,
    VideoChatService,
    ReferencesService
  ]
})

export class ConsultationModule {
}
