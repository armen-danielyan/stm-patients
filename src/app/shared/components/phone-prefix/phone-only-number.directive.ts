import { Directive, Input } from '@angular/core';
import { OnlyNumberDirective } from 'ng4-country-phone-select';

@Directive({
  selector: '[appOnlyNumber]'
})
export class PhoneOnlyNumberDirective extends OnlyNumberDirective {
  @Input()
  appOnlyNumber: boolean;
}
