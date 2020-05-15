import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from './../../../environments/environment';
import { RequestModel } from './../../modules/models/request-model';
import { BaaSUser } from './../../shared/models/user';

const putHeaders = () =>
  new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

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

  getUsers(): Observable<BaaSUser[]> {
    return this.http.get<BaaSUser[]>(`${this.apiBase}/users`);
  }

  // get all the users who group is of groupName or its sub-groups
  getUsersInGroup(groupName: string): Observable<BaaSUser[]> {
    return this.http.post<BaaSUser[]>(`${this.apiBase}/users/query`, {
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

  deleteUser(user: any) {
    // user should have at least email as property
    return this.http.request('delete', `${this.apiBase}/users`, {
      body: { user }
    });
  }
  updateUser(user: any) {
    return this.http.put(
      `${this.apiBase}/users`,
      { user },
      { headers: putHeaders(), responseType: 'text' as 'json' }
    );
  }
  // /users/{email}
  updateUserName(user: any) {
    return this.http.put(
      `${this.apiBase}/users/${user.email}`,
      { user },
      { headers: putHeaders(), responseType: 'text' as 'json' }
    );
  }
}
