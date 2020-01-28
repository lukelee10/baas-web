import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from './../../../environments/environment';
import { BaaSUser } from './../../shared/models/user';
import { RequestModel } from './../../modules/models/request-model';

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
  getProviders(): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/providers`);
  }

  getUserByEmailID(email: string): Observable<BaaSUser> {
    const url = encodeURI(`${this.apiBase}/users/${email}`);

    return this.http.get<BaaSUser>(url);
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
}
