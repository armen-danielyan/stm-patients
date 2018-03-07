import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserAggrService {

  private baseUrl: string = environment.api.url;

  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private http: HttpClient, private router: Router) {
  }


  getServiceRules() {
    return this.http.get(`${this.baseUrl}/common/static-page/service-rules`, { headers: this.headers });
  }

  getPrivacyPolicy() {
    return this.http.get(`${this.baseUrl}/common/static-page/privacy-policy`, { headers: this.headers });
  }

  acceptUserAggreement(checkboxes) {
    return this.http.post(`${this.baseUrl}/patient/core/agreement/accept-service-rules`, checkboxes);

  }

}
