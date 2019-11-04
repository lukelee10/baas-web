import { Injectable } from '@angular/core';
import { cognito } from '../../../environments/environment';

import {AuthenticationDetails, CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private loggedUser: string;
  private cognitoUser: CognitoUser;

  constructor() {
  }

  AuthenticateUser(userName: string, password: string, callback: any) {
    const authenticationData = {
      Username : userName,
      Password : password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const poolData = {
      UserPoolId : cognito.userPoolId,
      ClientId : cognito.appClientId
    };

    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username : userName,
      Pool : userPool
    };

    this.cognitoUser = new CognitoUser(userData);
    this.cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(result ) {
        this.jwtToken = result.getAccessToken().getJwtToken(); // we need accessToken for making lamda calls
        callback.cognitoCallback(null, result);
      },

      onFailure(err) {
        callback.cognitoCallback(err.message || JSON.stringify(err), null);
      }
    });
  }

  get GetJwtToken(): string {
//    return this.jwtToken;
    return sessionStorage.getItem('jwtToken');
  }

  set SetJwtToken(value: string) {
//    this.jwtToken = value;
    sessionStorage.setItem('jwtToken', value);
  }

  get IsAuthenticated(): boolean {
    return this.GetJwtToken === null ? false : true;
  //  return this.isAuthenticated;
  }


  get LoggedUser(): string {
    return this.loggedUser;
  }

  set LoggedUser(value: string) {
    this.loggedUser = value;
  }

  get isAdmin(): boolean {
    return true;
  }

  Logout() {
//    this.isAuthenticated = false;
    sessionStorage.removeItem('jwtToken');
    this.cognitoUser.signOut();
  }
}
