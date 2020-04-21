import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  AppMessage,
  AppMessagesService
} from '../services/app-messages.service';
import { NotificationService } from './../../shared/services/notification.service';
import { AppGlobalConstants } from './../app-global-constants';
import { AuthenticationService } from './../services/authentication.service';

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
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
          this.notificationService.warning(errorMessage);
        } else {
          // server-side error
          if (error.status === AppGlobalConstants.TimeOutErrorCode) {
            this.notificationService.warning(
              this.appMessagesService.getMessage(AppMessage.SessionTimeOut),
              this.appMessagesService.getTitle(AppMessage.SessionTimeOut)
            );

            this.authenticationService.Logout();
            this.router.navigate(['/login']);
          } else {
            const err =
              typeof error.error === 'string'
                ? JSON.parse(error.error)
                : error.error;
            errorMessage = !err.errorDetail ? error.message : err.errorDetail;
            errorMessage = `Error: ${errorMessage}`;
          }
        }
        return throwError(errorMessage);
      })
    );
  }
}
