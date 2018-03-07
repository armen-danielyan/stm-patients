import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService, WebStorageModule } from 'angular-localstorage';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { ConsultationComponent } from './consultation/consultation.component';
import { PaymentsEmptyComponent } from './payments-empty/payments-empty.component';
import { PaymentsFilledComponent } from './payments-filled/payments-filled.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PaymentsProcessComponent } from './payments-process/payments-process.component';
import { PaymentCardComponent } from './payment-card/payment-card.component';
import { GlobalRoutingComponent } from './global-routing/global-routing.component';
import { MY_FORMATS } from './personal-data/personal-data.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { DialogComponent } from './shared/components/dialog/dialog.component';

import { GlobalRoutingService } from './shared/services/global-routing.service';
import { ScriptLoaderService } from './shared/services/script-loader.service';
import { UserLoginService } from './shared/services/user-login.service.';
import { SpprService } from './shared/services/sppr.service';
import { HistoryService } from './shared/services/history.service';
import { ComplainService } from './shared/services/complain.service';
import { UserAggrService } from './shared/services/user-aggr.service';
import { ProfileApiService } from './shared/services/profile-api.service';
import { GuardService } from './shared/services/guard.service';
import { UserRegistrationService } from './shared/services/user-registration.service';
import { CognitoUtil } from './shared/services/cognito.service';
import { AwsUtil } from './shared/services/aws.service';
import { BadgesService } from './shared/services/badges.service';
import { LocationService } from './shared/services/location/location.service';
import { RefreshGuardService } from './shared/services/refresh-guard.service';

import { PersonalViewGuard } from './guard/personal-view.guard';
import { PersonalDataGuard } from './guard/personal-data.guard';
import { AuthGuard } from './guard/auth.guard';
import { MainGuard } from './guard/main.guard';
import { CanDeactivateDialogGuard } from './guard/can-deactivate-dialog.guard';

import { APP_CONFIG, APP_CONFIG_TOKEN } from './app.config';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    GlobalRoutingComponent,
    PaymentsEmptyComponent,
    PaymentsFilledComponent,
    NavbarComponent,
    FooterComponent,
    PaymentsProcessComponent,
    PaymentCardComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    HttpModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    BrowserAnimationsModule
  ],
  providers: [
    AwsUtil,
    CognitoUtil,
    UserRegistrationService,
    AuthGuard,
    GuardService,
    PersonalDataGuard,
    GlobalRoutingService,
    ScriptLoaderService,
    SpprService,
    UserLoginService,
    MainGuard,
    HistoryService,
    ComplainService,
    PersonalViewGuard,
    UserAggrService,
    ProfileApiService,
    BadgesService,
    RefreshGuardService,
    CanDeactivateDialogGuard,
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'ru-RU'
    },

    LocationService,

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_MOMENT_DATE_FORMATS
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS
    },
    {
      provide: APP_CONFIG_TOKEN,
      useValue: APP_CONFIG
    }
  ],
  entryComponents: [
    DialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
