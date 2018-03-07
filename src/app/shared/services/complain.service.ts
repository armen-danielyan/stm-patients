import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CognitoUtil } from './cognito.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ComplainService {
  private baseUrl: string = environment.api.url;
  general_complain;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  header_auth;

  constructor(private http: HttpClient, private cUtil: CognitoUtil) {
  }

  //complaint-doctors-subject
  getDoctorSubjects() {
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      this.header_auth = new HttpHeaders()
        .set('Authorization', session.getIdToken().getJwtToken());
    });
    return this.http.get(`${this.baseUrl}/patient/core/reference/complaint-doctors-subject`, { headers: this.header_auth });
  }

  //submit complain form(for auth user)
  submitComplain(data) {
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      this.header_auth = new HttpHeaders()
        .set('Authorization', session.getIdToken().getJwtToken());
    });
    return this.http.post(`${this.baseUrl}/patient/core/complaint-user`, data, { headers: this.header_auth });
  }

  //submit complain form(for all users from login page)
  submitComplainGeneral() {
    return this.http.post(`${this.baseUrl}/common/complaint`, JSON.stringify(this.general_complain), { headers: this.headers });
  }

}
