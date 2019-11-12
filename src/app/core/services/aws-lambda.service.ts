import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationService } from './../../shared/services/notification.service';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaService {
  private apiBase: string;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
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
      },
      error => {
        const message = JSON.stringify(error);
        this.notificationService.show('Audit ' +  action  + ' Failed');
      }
    );
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiBase}/users`)
      .pipe(map((res: any) => res), catchError(this.handleError));
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
