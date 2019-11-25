import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

import { NotificationService } from './../../shared/services/notification.service';

import { environment } from './../../../environments/environment';
import { AppGlobalConstants } from '../app-global-constants';

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
        this.notificationService.error(`Audit ${action} Failed`);
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
        if (error.status === AppGlobalConstants.TimeOutErrorCode) {
          errorMessage = AppGlobalConstants.TimeOutErrorCode.toString();
        } else {
          errorMessage = `${error.statusText}: Url is ${error.url}`;
        }
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

/*   printLog(event: any) {
    if  (event instanceof HttpResponse || event instanceof HttpErrorResponse) {
      const currentDate = '[' + new Date().toLocaleString() + '] ';
      const logType = event instanceof HttpErrorResponse ? 'ERROR' : 'INFO';
      this.notificationService.debugLogging(
        currentDate +
          logType +
          ' ' +
          'Event URL:' +
          event.url +
          ' \n status code: ' +
          event.status +
          ' \n status text: ' +
          event.statusText
      );
    }
  }
 */
}
