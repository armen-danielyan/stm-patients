import { environment } from "../../../environments/environment";

export let _REGION = environment.aws.cognito.region;

export let _IDENTITY_POOL_ID = environment.aws.cognito.identityPoolId;
export let _USER_POOL_ID = environment.aws.cognito.userPoolId;
export let _CLIENT_ID = environment.aws.cognito.clientId;
//export let _MOBILE_ANALYTICS_APP_ID = "8ed115bcfac94dfa8e364aa5ef201849";

export let _POOL_DATA = {
  UserPoolId: _USER_POOL_ID,
  ClientId: _CLIENT_ID
};
