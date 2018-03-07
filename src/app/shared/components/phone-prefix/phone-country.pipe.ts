import { Pipe, PipeTransform } from '@angular/core';
import { CountryPipe } from 'ng4-country-phone-select';

@Pipe({
  name: 'phoneCountry'
})
export class PhoneCountryPipe extends CountryPipe implements PipeTransform {}
