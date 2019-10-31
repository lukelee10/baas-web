import { Injectable } from '@angular/core';
import { cognito } from './../../../environments/environment';

import {AuthenticationDetails, CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';


export interface Callback {
  cognitoCallback(message: string, result: any): void;
}

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private isAuthenticated: boolean;
  private loggedUser: string;
  private cognitoUser: CognitoUser;

  constructor() {
    this.isAuthenticated = false;
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
        const accessToken = result.getAccessToken().getJwtToken(); // we need accessToken for making lamda calls
        callback.cognitoCallback(null, result);
      },

      onFailure(err) {
        callback.cognitoCallback(err.message || JSON.stringify(err), null);
      }
    });
  }


  get IsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  set IsAuthenticated(value: boolean) {
    this.isAuthenticated = value;
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
    this.isAuthenticated = false;
    this.cognitoUser.signOut();
  }
}
