import { Injectable } from '@angular/core';
import { CognitoCallback, CognitoUtil, RegistrationUser } from './cognito.service';
import { UserLoginService } from './user-login.service.';
import { Router } from '@angular/router';


declare let AWS: any;
declare let AWSCognito: any;


@Injectable()
export class UserRegistrationService {

  public phone_global: string;
  public email_global: string;
  public password_global: string;
  public isloginpassword_global: string;
  public errormessagePassword: string;

  public reset_phone_number: string;

  public navigate: boolean = false;

  constructor(public cUtil: CognitoUtil, public userService: UserLoginService,
              private router: Router) {
  }

  register(user: RegistrationUser, callback: CognitoCallback): void {

    let attributeList = [];

    let dataEmail = {
      Name: 'email',
      Value: user.email
    };
    let dataNickname = {
      Name: 'phone_number',
      Value: user.phone_number
    };
    attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail));
    attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataNickname));

    this.cUtil.getUserPool().signUp(user.phone_number, user.password, attributeList, null, function (err, result) {
      if (err) {
        // Jesus!
        var word1 = 'account';
        var word2 = 'already';
        var word3 = 'exists';
        var temp_message = err.message;
        if (temp_message.indexOf(word1) !== -1 && temp_message.indexOf(word2) !== -1 && temp_message.indexOf(word3) !== -1) {
          err.message = 'Данный номер уже зарегистрирован';
        }
        callback.cognitoCallback(err.message, null);
      } else {
        callback.cognitoCallback(null, result);
      }
    });
  }

  confirmRegistration(username: string, confirmationCode: string, callback: CognitoCallback): void {

    let userData = {
      Username: username,
      Pool: this.cUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
      if (err) {
        err.message = 'Неправильный код';
        callback.cognitoCallback(err.message, null);
      } else {
        callback.cognitoCallback(null, result);
      }
    });
  }


  resendCode(username: string, callback: CognitoCallback): void {
    let userData = {
      Username: username,
      Pool: this.cUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) {
        callback.cognitoCallback(err.message, null);
      } else {
        callback.cognitoCallback(null, result);
      }
    });
  }

  changePassword(oldpass: string, newpass: string, callback: CognitoCallback): void {
    const cognitoUser = this.cUtil.getCurrentUser();

    cognitoUser && cognitoUser.getSession(function (err, session) {
      if (err) {
        alert(err);
        return;
      }
    });

    cognitoUser && cognitoUser.changePassword(oldpass, newpass, function (err, result) {
      if (err) {
        callback.cognitoCallback(err.message, null);
        return;
      }
      callback.cognitoCallback(null, result);
      return;
    });
  }

  forgoteenPassword(username: string, verificationCode: string, newpass: string, callback: CognitoCallback): void {
    let userData = {
      Username: username,
      Pool: this.cUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser && cognitoUser.getSession(function (err, session) {
      if (err) {
        alert(err);
        return;
      }
    });

    cognitoUser && cognitoUser.forgotPassword({
      onSuccess: function (result) {
        console.log('call result: ' + result);
      },
      onFailure: function (err) {
        alert(err);
      },
      inputVerificationCode() {
        cognitoUser.confirmPassword(verificationCode, newpass, this);
      }
    });
  }

  forgotpass(username: string): void {
    let userData = {
      Username: username,
      Pool: this.cUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: function (data) {
        // successfully initiated reset password request
        console.log('CodeDeliveryData from forgotPassword: ' + data);
      },
      onFailure: function (err) {
        console.log(err.message);
      },
      //Optional automatic callback
      inputVerificationCode: function (data) {
        this.navigate = true;
        return data;
      }
    });
  }

  forgotpass1(username: string, callback?): void {
    let userData = {
      Username: username,
      Pool: this.cUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: function (data) {
        // successfully initiated reset password request
        console.log('CodeDeliveryData from forgotPassword: ' + data);
      },
      onFailure: function (err) {
        console.log(err.message);
        var word1 = 'limit';
        var word2 = 'exceeded';
        var temp_message = err.message;
        if (temp_message.indexOf(word1) !== -1 && temp_message.indexOf(word2) !== -1) {
          err.message = 'Вы слишком часто пытались поменять пароль';
        }
        else {
          err.message = 'Пользователь не существует';
        }
        alert(err.message);
      },
      //Optional automatic callback
      inputVerificationCode: function (data) {
        this.navigate = true;
        callback(data, true);
      }
    });
  }

  confirmnewpass(username: string, verificationCode: string, newPassword: string, callback: CognitoCallback): void {
    let userData = {
      Username: username,
      Pool: this.cUtil.getUserPool()
    };
    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess(succcess) {
        callback.cognitoCallback(null, succcess);
        return;
      },
      onFailure(err) {
        err.message = 'Неправильный код';
        callback.cognitoCallback(err.message, null);
        return;
      }
    });
  }


  changeNumber(username: string, callback: CognitoCallback) {
    const cognitoUser = this.cUtil.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          alert(err);
          return;
        }

        const attributeList = [];
        const attributes = {
          Name: 'phone_number',
          Value: username,
        };

        const attribute = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(attributes);
        attributeList.push(attribute);

        cognitoUser.updateAttributes(attributeList, function (err, result) {
          if (err) {
            var word1 = 'phone_number';
            var word2 = 'exists';
            var temp_message = err.message;
            if (temp_message.indexOf(word1) !== -1 && temp_message.indexOf(word2) !== -1) {
              err.message = 'Этот номер уже зарегистрирован';
            }
            callback.cognitoCallback(err.message, null);
            return;
          }

        });
      });
    }
  }

  VerificationCode(code: string, callback: CognitoCallback) {
    const cognitoUser = this.cUtil.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          alert(err);
          return;
        }
      });

      cognitoUser.verifyAttribute('phone_number', code, {
        onSuccess: success => {
          this.userService.logout();
          localStorage.setItem('isloggedin', 'false');
          localStorage.setItem('personal_data_page', 'false');
          localStorage.setItem('phone_number', '');
          localStorage.setItem('register-step-1', 'false');
          localStorage.setItem('register-step-2', 'false');
          localStorage.setItem('register-step-3', 'false');
          localStorage.clear();
          this.router.navigate(['./login']);
        },
        onFailure: err => {
          var word1 = 'Invalid ';
          var word2 = 'code';
          var word3 = 'verification';
          var temp_message = err.message;
          if (temp_message.indexOf(word1) !== -1 && temp_message.indexOf(word2) !== -1 && temp_message.indexOf(word3) !== -1) {
            err.message = 'Неправильный код';
          }
          callback.cognitoCallback(err.message, null);
        }
      });
    }
  }

  resendCodeRegister(username: string): void {
    let userData = {
      Username: username,
      Pool: this.cUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        console.log(result);
      }
    });
  }

}
