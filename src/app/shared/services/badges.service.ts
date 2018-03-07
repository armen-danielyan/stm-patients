import { Injectable } from '@angular/core';
import { CognitoUtil } from './cognito.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable()
export class BadgesService {

  constructor(private http: HttpClient, public cUtil: CognitoUtil) { }
  private baseUrl: string = `${environment.api.url}/patient`;
  getBadgesCounts() {
    let headers: HttpHeaders;
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());
    });
    return this.http.get(this.baseUrl + '/core/badge', { headers: headers });
  }

  getBadgesExpanded(): any {
    let headers: HttpHeaders;
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());
    });
    return this.http.get(this.baseUrl + '/core/badge?expanded=1', { headers: headers });
  }
}
