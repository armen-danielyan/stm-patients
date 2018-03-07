import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/switchMap';

import { ICountry } from "../../../models/country/ICountry";
import { environment } from "../../../../environments/environment";

@Injectable()
export class LocationService {

  private freegeoipUrl: string = environment.endPoints.freegeoip;
  private restcountriesUrl: string = environment.endPoints.restcountries;

  constructor(
    private http: HttpClient
  ) {}

  getCurrentLocation(): Observable< ICountry > {
    return this.http
    .get(`${this.freegeoipUrl}/`)
    .switchMap( (response: any) => {
      console.log('Got Country by current location \n', response);
      response = response || {};

      return this.http
      .get(`${this.restcountriesUrl}?codes=${response.country_code}`)
      .map( (response: any) => {
        console.log('Got Phone Code by Country Code \n', response);

        response = response || [];
        response[0] = response[0] || {};

        response[0].callingCodes = response[0].callingCodes || {};

        response.country_code = response.country_code || ''

        const country: ICountry = <ICountry>{
          name: response[0].name, // Россия
          dialCode: response[0].callingCodes[0], // 7
          countryCode: response.country_code.toLowerCase() // ru
        };

        return country;
      })

    });
  }

}
