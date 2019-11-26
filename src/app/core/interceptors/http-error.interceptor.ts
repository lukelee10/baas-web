import { Injectable } from '@angular/core';
import { HttpEvent,
         HttpInterceptor,
         HttpHandler,
         HttpRequest,
         HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthenticationService } from './../services/authentication.service';
import { NotificationService } from './../../shared/services/notification.service';

import { AppGlobalConstants } from './../app-global-constants';

@Injectable({
  providedIn: 'root'
})

export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
            this.notificationService.warning(errorMessage);
          } else {
            // server-side error
            if (error.status === AppGlobalConstants.TimeOutErrorCode) {
              this.notificationService.warning('You need to login back to continue your session', 'Session Timeout');
              this.authenticationService.Logout();
              this.router.navigate(['/login']);
            } else {
              errorMessage = `Error Code: ${error.status}  Message: ${error.message}`;
              this.notificationService.warning(errorMessage);
            }
          }
          return throwError(errorMessage);
        })
      );
  }
}
