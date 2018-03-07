import { Injectable } from '@angular/core';
import { CognitoUtil } from './cognito.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare let AWS: any;
declare let AWSCognito: any;

@Injectable()
export class SpprService {

  private baseUrl: string = environment.api.url;
  public headers;

  constructor(public cUtil: CognitoUtil, private http: HttpClient) {
  }


  getDisease() {
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      if (err) {
        alert(err);
        return;
      }

      this.headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());

    });
    return this.http.get(`${this.baseUrl}/patient/sppr/dict/specStates`, { headers: this.headers });
  }

  getAlergy(name: any) {

    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      if (err) {
        alert(err);
        return;
      }

      this.headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());
    });
    return this.http.get(`${this.baseUrl}/patient/sppr/dict/allergies?namePart=${name}`, { headers: this.headers });
  }


}
