import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MatProgressSpinnerModule, MatDialogModule } from '@angular/material';

import { DatepickerMaskDirective } from './directives/datepicker-mask.directive';
import { ScrollDirective } from './directives/scroll/scroll.directive';
import { PhoneOnlyNumberDirective } from './components/phone-prefix/phone-only-number.directive';

import { PhoneCountryPipe } from './components/phone-prefix/phone-country.pipe';

import { PhonePrefixComponent } from './components/phone-prefix/component/phone-prefix.component';
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TextMaskModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    TextMaskModule,
    MatProgressSpinnerModule,
    MatDialogModule,

    DatepickerMaskDirective,
    ScrollDirective,
    PhonePrefixComponent,
    DialogComponent
  ],
  declarations: [
    DatepickerMaskDirective,
    PhonePrefixComponent,
    ScrollDirective,
    PhoneCountryPipe,
    PhoneOnlyNumberDirective,
    PhonePrefixComponent,
    DialogComponent,
  ],
  providers: [],
})
export class SharedModule {
}
