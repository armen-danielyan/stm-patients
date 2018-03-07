import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CognitoCallback, LoggedInCallback, CognitoUtil } from './cognito.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class HistoryService {
  private baseUrl:string = environment.api.url;
  headers;

  constructor(private http: HttpClient, public cUtil: CognitoUtil, private router: Router) {
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      this.headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());
    });

  }

  getAppealHistory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/core/appointment/history`, { headers: this.headers });
  }

  getHistoryConsultation(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/core/appointment/` + id, { headers: this.headers });
  }

  getDoctorInfo(ids): Observable<any> {
    return this.http.post(`${this.baseUrl}/patient/profile/getdoctors`, ids, { headers: this.headers });
  }

}
