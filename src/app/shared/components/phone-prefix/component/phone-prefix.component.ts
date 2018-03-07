import {
  AfterViewInit, Component, ElementRef, forwardRef, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CountryService, IntPhonePrefixComponent, LocaleService, Country } from 'ng4-country-phone-select';
import PerfectScrollbar from 'perfect-scrollbar';
import * as Inputmask from 'inputmask/dist/inputmask/inputmask.phone.extensions';
import 'inputmask/dist/inputmask/phone-codes/phone.js';

import { PhoneLocaleService } from '../../../services/phone-locale.service';
import { ScrollDirective } from '../../../directives/scroll/scroll.directive';

const metadata = Reflect.get( IntPhonePrefixComponent, 'decorators' )[0];
const params = metadata.args[0];

export function validatePhone(controller: FormControl) {
  const error = {
    mask: false
  };

  const isValid = Inputmask.isValid(controller.value, { alias: 'phone' });
  return isValid ? null : error;
}

@Component({
  selector: 'app-phone-prefix',
  templateUrl: './phone-prefix.component.html',
  styleUrls: [ './phone-prefix.component.scss' ],
  host: params.host,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhonePrefixComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useValue: validatePhone,
      multi: true
    },
    { provide: LocaleService, useClass: PhoneLocaleService },
    CountryService
  ]
})
export class PhonePrefixComponent extends IntPhonePrefixComponent implements OnInit, AfterViewInit {

  @ViewChild( ScrollDirective, { read: ElementRef } )
  private scrollElement: ElementRef;

  private scroll: PerfectScrollbar;

  public readonly ACTIVE_CLASS = 'active';

  constructor(
    service: CountryService,
    localeService: LocaleService,
    phoneComponent: ElementRef,
    private http: HttpClient,
    private element: ElementRef
  ) {
    super(service, localeService, phoneComponent);
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.phoneInput) {
      this.getCurrentLocation().subscribe( (countryCode: string) => {
        this.updateSelectedCountry({ preventDefault: () => {} } as Event, countryCode);
      });
    }
  }

  showDropDown() {
    super.showDropDown();
    setTimeout( this.scrollUpdate );
  }

  ngAfterViewInit() {
    const input = this.element.nativeElement.querySelector('input');
    new Inputmask('phone', {
      showMaskOnFocus: false,
      clearMaskOnLostFocus: false
    }).mask(input);
  }

  private getCurrentLocation(): Observable<string> {
    return this.http.get('https://freegeoip.net/json/')
    .map((response: any) => response.country_code.toLowerCase());
  }

  private scrollUpdate = () => {
    const container = this.scrollElement.nativeElement;
    const activeElement = container.querySelector(`.${this.ACTIVE_CLASS}`);

    container.scrollTop = activeElement ? activeElement.offsetTop : 0;
  }

}
