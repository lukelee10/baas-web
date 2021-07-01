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

const enum InterceptError {
  TimeOutError = 'Session Time-out error',
  StandardError = 'Lamda returns error in standard Error Schema Format',
  CustomError = 'forgotPassword Lambda implements custom error, requires special handling',
  OtherError = 'Unhandled Server Exceptions'
}

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

  // Refer the following Flow-Chart to understand the Error Handling
  // https://confluence.sdo.leidos.com/display/REACTS/BaaS+Lambda+HTTP+Status+Codes?preview=/56426775/88016036/image2020-7-31_9-30-18.png
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((httpResponse: HttpErrorResponse) => {
        this.notificationService.debugLogging(httpResponse);
        const errorType = this.getErrorType(httpResponse);
        let errorMessage = '';
        switch (errorType) {
          case InterceptError.TimeOutError:
            this.handleSessionTimeOut(httpResponse);
            return of(null);
          case InterceptError.StandardError:
            errorMessage = this.parseStandardError(httpResponse);
            return throwError(errorMessage);
          case InterceptError.CustomError:
            // Custom Error implemented by forgotPassword
            // TODO forgotPassword Lambda needs to be fixed to implement Standard Error Schema.
            // When forgotPassword is fixed, the following can be removed
            errorMessage = this.parseCustomError(httpResponse);
            return throwError(errorMessage);
          default:
            errorMessage = this.parseOtherErrors(httpResponse);
            return throwError(errorMessage);
        }
      })
    );
  }

  getErrorType(httpResponse: HttpErrorResponse): InterceptError {
    let errorType: InterceptError;
    // Session Time-out Errors
    if (
      httpResponse.status ===
      AppGlobalConstants.HttpErrorResponseCode.TimeOutErrorCode
    ) {
      errorType = InterceptError.TimeOutError;
    } else {
      // Custom Error
      if (httpResponse.error && httpResponse.error.body) {
        errorType = InterceptError.CustomError;
      } else {
        // Standard Error that follows Error Schema
        if (this.isStandardError(httpResponse)) {
          errorType = InterceptError.StandardError;
        } else {
          errorType = InterceptError.OtherError;
        }
      }
    }

    return errorType;
  }

  private isStandardError(httpResponse) {
    let standardErrorFlag = false;
    try {
      if (typeof httpResponse.error === 'object') {
        // JSON
        standardErrorFlag = httpResponse.error.errorDetail !== undefined;
      } else {
        standardErrorFlag =
          JSON.parse(httpResponse.error).errorDetail !== undefined;
      }
    } catch {
      standardErrorFlag = false;
    }
    return standardErrorFlag;
  }

  handleSessionTimeOut(httpResponse: HttpErrorResponse) {
    this.notificationService.warning(
      this.appMessagesService.getMessage(AppMessage.SessionTimeOut),
      this.appMessagesService.getTitle(AppMessage.SessionTimeOut)
    );
    this.authenticationService.Logout();
    this.router.navigate(['/login']);
  }
  parseStandardError(httpResponse: HttpErrorResponse) {
    const errorMessage =
      typeof httpResponse.error === 'object'
        ? `Error: ${httpResponse.error.errorDetail}`
        : `Error: ${JSON.parse(httpResponse.error).errorDetail}`;

    return errorMessage;
  }
  parseCustomError(httpResponse: HttpErrorResponse) {
    const errorMessage =
      typeof httpResponse.error.body === 'object'
        ? `Error: ${httpResponse.error.body.errorDetail}`
        : `Error: ${JSON.parse(httpResponse.error.body).errorDetail}`;
    this.notificationService.error(errorMessage, 'BaaS Notification - Error');
    return errorMessage;
  }
  parseOtherErrors(httpResponse: HttpErrorResponse) {
    let errorMessage = '';
    if (
      httpResponse.status ===
        AppGlobalConstants.HttpErrorResponseCode.InvalidHttpRequest ||
      httpResponse.status ===
        AppGlobalConstants.HttpErrorResponseCode.UnauthorizedAccess
    ) {
      errorMessage = `Error: ${httpResponse.message}`;
    } else {
      errorMessage = `Error: ${this.appMessagesService.getMessage(
        AppMessage.ServerOperationError
      )}`;
    }

    return errorMessage;
  }
}
