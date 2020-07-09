import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  AppMessage,
  AppMessagesService
} from '../services/app-messages.service';
import { NotificationService } from './../../shared/services/notification.service';
import { AppGlobalConstants } from './../app-global-constants';
import { AuthenticationService } from './../services/authentication.service';

// TODO -- Fix the Server Side Time Out (Session) HTTP Response Code
// Server is throwing 401 response code from updateActivityTimestamp layer
// when server session timed out, which we need to revisit and change it to
// more appropriate http response code
// On client when the http response code is 408, the client shows
// AppMessage.SessionTimeOut message, a very friendly message
@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private appMessagesService: AppMessagesService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notificationService.debugLogging(error);
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
          this.notificationService.warning(errorMessage);
          return of(null);
        } else {
          // server-side error
          const httpErrorResponseCode = error.status;
          const errorBody = error.error.body
            ? JSON.parse(error.error.body)
            : null;
          if (
            httpErrorResponseCode ===
            AppGlobalConstants.HttpErrorResponseCode.TimeOutErrorCode
          ) {
            this.notificationService.warning(
              this.appMessagesService.getMessage(AppMessage.SessionTimeOut),
              this.appMessagesService.getTitle(AppMessage.SessionTimeOut)
            );
            this.authenticationService.Logout();
            this.router.navigate(['/login']);
            return of(null);
          } else if (
            errorBody &&
            errorBody.errorDetail &&
            errorBody.errorDetail.length > 0
          ) {
            this.notificationService.error(
              errorBody.errorDetail,
              'BaaS Notification - Error'
            );
            return throwError(errorMessage);
          } else {
            const err = typeof error.error === 'string' ? error : error.error;
            errorMessage = err.errorDetail ? err.errorDetail : error.message;
            if (
              httpErrorResponseCode ===
                AppGlobalConstants.HttpErrorResponseCode.InvalidHttpRequest ||
              httpErrorResponseCode ===
                AppGlobalConstants.HttpErrorResponseCode.UnathorizedAccess
            ) {
              errorMessage = `Error: ${errorMessage}`;
            } else {
              errorMessage = `Error: ${this.appMessagesService.getMessage(
                AppMessage.ServerOperationError
              )}`;
            }
            return throwError(errorMessage);
          }
        }
      })
    );
  }
}
