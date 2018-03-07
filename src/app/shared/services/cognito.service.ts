import { Injectable } from '@angular/core';
import { _POOL_DATA } from './properties.service';

declare let AWS: any;
declare let AWSCognito: any;

export class RegistrationUser {
  email: string;
  phone_number: string;
  password: string;
}

export class User {
  last_name: string;
  first_name: string;
  mid_name: string;
  birth_date: string;
  gender_id: any;
  height: number;
  weight: number;
  chronic_diseases: string;
  allergies: string;
  country: string;
  city: string;
}

export class UserInfo {
  patient_id: string;
  language_id: number;
  doctor_specialization_id: number;
  doctor_rank_id: number;
  message: string;
}

export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void;
}

export interface ChatCallback {
  ChatCallback(message: string, result: string): void;
}

export interface LoggedInCallback {
  isLoggedInCallback(message: string, loggedIn: boolean): void;
}

export interface Callback {
  callback(): void;

  callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoUtil {

  constructor() {
  }

  getUserPool() {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(_POOL_DATA);
  }

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }


  getCognitoIdentity(): string {
    return AWS.config.credentials.identityId;
  }

  getAccessToken(callback: Callback): void {
    if (callback == null) {
      throw ('callback in getAccessToken is null...returning');
    }
    this.getCurrentUser() && this.getCurrentUser().getSession(function (err, session) {
      if (err) {
        callback.callbackWithParam(null);
      }

      else {
        if (session.isValid()) {
          callback.callbackWithParam(session.getAccessToken().getJwtToken());
        }
      }
    });
  }

  getIdToken(callback: Callback): void {
    if (callback == null) {
      throw ('callback in getIdToken is null...returning');
    }
    this.getCurrentUser() && this.getCurrentUser().getSession(function (err, session) {
      if (err) {
        callback.callbackWithParam(null);
      }
      else {
        if (session.isValid()) {
          callback.callbackWithParam(session.getIdToken().getJwtToken());
        } else {
        }
      }
    });
  }

  getRefreshToken(callback: Callback): void {
    if (callback == null) {
      throw ('callback in getRefreshToken is null...returning');
    }
    this.getCurrentUser() && this.getCurrentUser().getSession(function (err, session) {
      if (err) {
        callback.callbackWithParam(null);
      }

      else {
        if (session.isValid()) {
          callback.callbackWithParam(session.getRefreshToken());
        }
      }
    });
  }
}






