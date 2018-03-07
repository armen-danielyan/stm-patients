import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CognitoUtil, User } from './cognito.service';
import { Router } from '@angular/router';
import { UserLoginService } from './user-login.service.';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProfileApiService {

  private baseUrl: string = environment.api.url;
  headers;
  user: User = new User;
  profile_filled_id: number;


  constructor(private http: HttpClient, public cUtil: CognitoUtil, private router: Router, private userService: UserLoginService) {
  }

  // check user exists and receive data
  checkProfileData() {
    const cognitoUser = this.cUtil.getCurrentUser();
    if (cognitoUser) {
      cognitoUser && cognitoUser.getSession((err, session) => {
        this.headers = new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', session.getIdToken().getJwtToken());
      });
    }
    return this.http.get(`${this.baseUrl}/patient/profile/check`, { headers: this.headers });
  }

  createInfo() {
    return this.http.post(`${this.baseUrl}/patient/profile/add`, this.user, { headers: this.headers });
  }

  updateInfo() {
    return this.http.post(`${this.baseUrl}/patient/profile/update/` + this.profile_filled_id, this.user, { headers: this.headers });
  }

  checkOrLogout() {
    // check user exists if no logout user
    this.checkProfileData().subscribe(res => {
      if (res['message'] == 'User does not exist.') {
        this.userService.logout();
        localStorage.clear();
        this.router.navigate(['./login']);
      }
    });
    return true;
  }

}
