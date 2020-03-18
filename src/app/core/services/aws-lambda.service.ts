import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from './../../../environments/environment';
import { RequestModel } from './../../modules/models/request-model';
import { BaaSUser } from './../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaService {
  private apiBase: string;

  constructor(private http: HttpClient) {
    this.apiBase = environment.apiGateway.url;
  }

  auditLog(email: string, action: string) {
    const body = {
      email,
      action
    };

    this.http.post(this.apiBase + '/audit', body).subscribe(response => {
      const result = JSON.stringify(response);
    });
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/users`);
  }

  // get all the users who group is of groupName or its sub-groups
  getUsersInGroup(groupName: string): Observable<any> {
    return this.http.post(`${this.apiBase}/users/query`, {
      org: { name: groupName }
    });
  }
  getProviders(): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/providers`);
  }

  getUserByEmailID(email: string): Observable<BaaSUser> {
    const url = encodeURI(`${this.apiBase}/users/${email}`);

    return this.http.get<BaaSUser>(url);
  }

  createUser(newUser: any) {
    return this.http.post(`${this.apiBase}/users`, newUser);
  }

  resetPassword(userid: string) {
    return this.http.post(`${this.apiBase}/forgotpassword`, { userid });
  }

  confirmPassword(newCredential: any) {
    return this.http.post(`${this.apiBase}/forgotpassword`, newCredential);
  }

  createRequestPackage(requestModel: RequestModel) {
    return this.http.post(this.apiBase + '/requests', {
      package: requestModel
    });
  }

  deleteRequestPackage(requestId: string) {
    return this.http.delete(this.apiBase + `/requests?requestId=${requestId}`);
  }

  // get all the orgs and their groups and sub-groups.
  getOrgs() {
    return this.http.get<any>(`${this.apiBase}/orgs`);
  }
  // save a given org into API: the param = { org: {parentName: 'mom', name: 'theOrg' }}
  createOrg(newOrg: any) {
    return this.http.post(`${this.apiBase}/orgs`, newOrg);
  }
}
