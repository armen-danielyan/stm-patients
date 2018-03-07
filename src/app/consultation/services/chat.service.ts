import { Injectable } from '@angular/core';
import { ChatCallback, CognitoUtil } from '../../shared/services/cognito.service';
import { _IDENTITY_POOL_ID, _USER_POOL_ID, _REGION } from '../../shared/services/properties.service';
import { environment } from '../../../environments/environment';
import 'aws-sdk/dist/aws-sdk';

const albumBucketName = environment.aws.s3.user.bucket;
const bucketRegion = environment.aws.s3.user.region;
const IdentityPoolId = _IDENTITY_POOL_ID;
const AWS = window.AWS;


@Injectable()
export class ChatService {
  fileurl: string;

  constructor(public cUtil: CognitoUtil) {
    console.log(this.fileurl);
  }


  fileUploadChat(filename, body, chatCallback: ChatCallback) {

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

      s3.upload({
        Key: cognitoUser.getUsername() + '/' + filename,
        Body: body,
        ACL: 'public-read'
      }, function (error, data) {
        if (error) {
          return;
        }
        this.fileurl = data.Location;
        chatCallback.ChatCallback(this.fileurl, null);
        return;
      }).on('httpUploadProgress', function (event) {
        const upLoadFile = ((event.loaded * 100) / event.total);
        this.fixed = (upLoadFile.toFixed(0)) + '%';
        chatCallback.ChatCallback(null, this.fixed);

      });


    });
  }


}
