import { Injectable } from '@angular/core';

import { cognito } from '../../../environments/environment';

import {AuthenticationDetails, CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor() {
  }

  AuthenticateUser(userName: string, password: string, callback: any) {
    const authenticationData = {
      Username: userName,
      Password: password
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const poolData = {
      UserPoolId: cognito.userPoolId,
      ClientId: cognito.appClientId
    };

    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username: userName,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(result) {
        callback.cognitoCallback(null, result);
      },
      onFailure(err) {
        callback.cognitoCallback(err.message || JSON.stringify(err), null);
      }
    });
  }

  get JwtToken(): string {
    return sessionStorage.getItem('jwtToken');
  }

  set JwtToken(value: string) {
    sessionStorage.setItem('jwtToken', value);
  }
  get IsAgreementAccepted(): boolean {
    return   (/true/i).test(sessionStorage.getItem('agreementAccepted'));
  }

  set IsAgreementAccepted(value: boolean) {
    sessionStorage.setItem('agreementAccepted', String(value));
  }

  get IsAuthenticated(): boolean {
    return this.JwtToken === null ? false : true;
  }

  get LoggedUser(): string {
    return sessionStorage.getItem('loggedUser');
  }

  set LoggedUser(value: string) {
    sessionStorage.setItem('loggedUser', value);
  }

  get isAdmin(): boolean {
    return true;
  }

  Logout() {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('loggedUser');
    sessionStorage.clear();
  }
}
