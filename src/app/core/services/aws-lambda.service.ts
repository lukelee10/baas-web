import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaService {
  private apiBase: string;

  constructor(
    private http: HttpClient,
  ) {
    this.apiBase = environment.apiGateway.url;
  }

  auditLog(email: string, action: string) {
    const body = {
      email,
      action
    };

    this.http.post(this.apiBase + '/audit', body)
    .subscribe(
      response => {
        const result = JSON.stringify(response);
      }
    );
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/users`);
  }
}
