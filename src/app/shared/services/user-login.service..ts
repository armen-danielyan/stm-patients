import { Injectable } from '@angular/core';
import { CognitoCallback, CognitoUtil, LoggedInCallback } from './cognito.service';
import { _IDENTITY_POOL_ID, _USER_POOL_ID, _REGION } from './properties.service';
import { environment } from '../../../environments/environment';
import 'aws-sdk/dist/aws-sdk';

// declare let AWS: any;
declare let AWSCognito: any;
const albumBucketName = environment.aws.s3.user.bucket;
const bucketRegion = environment.aws.s3.user.region;
const AWS = window.AWS;
let delKey = null;


@Injectable()
export class UserLoginService {

  constructor(public cUtil: CognitoUtil) {
  }

  authenticate(username: string, password: string, callback: CognitoCallback) {
    let mythis = this;

    // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
    AWSCognito.config.update({ accessKeyId: 'anything', secretAccessKey: 'anything' });

    let authenticationData = {
      Username: username,
      Password: password,
    };
    let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    let userData = {
      Username: username,
      Pool: this.cUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        callback.cognitoCallback(null, result);
      },
      onFailure: function (err) {
        if (err.code = 'UserNotFoundException') {
          err.message = 'Неправильный логин или пароль';
        }
        callback.cognitoCallback(err.message, null);
      },
    });
  }

  forgotPassword(username: string, callback: CognitoCallback) {
    let userData = {
      Username: username,
      Pool: this.cUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: function (result) {

      },
      onFailure: function (err) {
        callback.cognitoCallback(err.message, null);
      },
      inputVerificationCode() {
        callback.cognitoCallback(null, null);
      }
    });
  }

  confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
    let userData = {
      Username: email,
      Pool: this.cUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.confirmPassword(verificationCode, password, {
      onSuccess: function (result) {
        callback.cognitoCallback(null, result);
      },
      onFailure: function (err) {
        callback.cognitoCallback(err.message, null);
      }
    });
  }

  logout() {
    if (this.cUtil.getCurrentUser() !== null) {
      this.cUtil.getCurrentUser().signOut();
    }
  }

  isAuthenticated(callback: LoggedInCallback) {
    if (callback == null)
      throw ('Callback in isAuthenticated() cannot be null');

    let cognitoUser = this.cUtil.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser && cognitoUser.getSession(function (err, session) {
        if (err) {
          callback.isLoggedInCallback(err, false);
        }
        else {
          callback.isLoggedInCallback(err, session.isValid());
        }
      });
    } else {
      callback.isLoggedInCallback('Can\'t retrieve the CurrentUser', false);
    }
  }

  /* CREATE PHOTO IN PERSONAL-DATA */
  createPhoto(filename, body) {
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession(function (err, session) {
      if (err) {
        alert(err);
        return;
      }
      AWS.config.region = _REGION;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: _IDENTITY_POOL_ID,
        Logins: {
          [`cognito-idp.${_REGION}.amazonaws.com/${_USER_POOL_ID}`]: session.getIdToken().getJwtToken()
        }
      });
      const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: albumBucketName },
        region: bucketRegion
      });

      filename = filename.trim();

      if (!filename) {
        return alert('Album names must contain at least one non-space character.');
      }
      if (filename.indexOf('/') !== -1) {
        return alert('Album names cannot contain slashes 3.');
      }


      delKey = cognitoUser.getUsername() + '/' + 'avatar.jpeg';

      s3.upload({
        Key: delKey,
        Body: body,
        ContentType: 'image/jpeg',
        ACL: 'public-read'
      }, function (error, data) {
        if (error) {
          return;
        }
      });

    });
  }

  /* DELETE PHOTO IN PERSONAL-DATA */
  deletePhoto(name) {
    const cognitoUser = this.cUtil.getCurrentUser();

    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: albumBucketName },
      region: bucketRegion
    });

    const params = {
      Bucket: albumBucketName, // 'mybucket'
      Key: cognitoUser.getUsername() + '/' + 'avatar.jpeg'
    };

    s3.deleteObject(params, function (err, data) {
      if (err) {
        return;
      }
    });
  }

}
