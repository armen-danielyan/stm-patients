import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { AuthGuard } from './guard/auth.guard';

import { ComplainComponent } from './complain/complain.component';
import { ConsultationComponent } from './consultation/consultation.component';

import { MainGuard } from './guard/main.guard';


import { PersonalViewGuard } from './guard/personal-view.guard';
import { NgModule } from '@angular/core';
import { PersonalDataGuard } from './guard/personal-data.guard';


const APP_ROUTES: Routes = [
  {
    path: '', redirectTo: 'main', pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [PersonalDataGuard]
  },
  {
    path: 'register',
    loadChildren: './register/register.module#RegisterModule'
  },
  {
    path: 'change',
    loadChildren: './change/change.module#ChangeModule'
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [MainGuard]
  },
  {
    path: 'personal-data',
    loadChildren: './personal-data/personal-data.module#PersonalDataModule'
  },
  {
    path: 'personal-view',
    loadChildren: './personal-view/personal-view.module#PersonalViewModule'
  },
  {
    path: 'reset-password',
    loadChildren: './reset-password/reset-password.module#ResetPasswordModule'
  },
  {
    path: 'history',
    loadChildren: './history/history.module#HistoryModule'
  },
  {
    path: 'complain',
    loadChildren: './complain/complain.module#ComplainModule'
  },
  {
    path: 'consultation',
    loadChildren: './consultation/consultation.module#ConsultationModule'
  },
  {
    path: 'feedback',
    loadChildren: './feedback/feedback.module#FeedbackModule'
  },
  {
    path: '**', redirectTo: 'main', pathMatch: 'full',
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES),
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule {
}

