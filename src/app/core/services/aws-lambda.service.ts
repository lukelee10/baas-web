import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
    return this.http.get(`${this.apiBase}/users`)
      .pipe(map((res: any) => res), catchError(this.handleError));
  }

  resetPassword(userid: string): void {
    this.http.post(`${this.apiBase}/forgotpassword`, { userid })
  }

  confirmPassword(newCredential: any) {
    return this.http.post(`${this.apiBase}/forgotpassword`, newCredential);
  }

  private handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      let errorMessage = '';
      try {
        errorMessage = error.message;
      } catch (err) {
        errorMessage = error.statusText;
      }
      return throwError(errorMessage);
    } else {
      if (error.status) {
        return throwError(error.status);
      }
    }

    return of(error || 'Epic Fail');
  }
}
