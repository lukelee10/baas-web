import 'rxjs/add/operator/do';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MessageDialogComponent } from 'src/app/shared/components/message-dialog/message-dialog.component';
import { debugLogging } from 'src/environments/environment';

import { AuthenticationService } from '../services/authentication.service';
import { AppGlobalConstants } from './../app-globals';


@Injectable({
  providedIn: 'root'
})
export class HttpCallInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).do(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.handleEvent(event);
        }
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          this.handleEvent(err);
        }
      }
    );
  }

  handleEvent(event: any) {
    this.printLog(event);
    if (event.status === AppGlobalConstants.TimeOutErrorCode) {
      const currentDate = '[' + new Date().toLocaleString() + '] ';
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Session Timeout',
          message: 'You need to login back to continue your session',
          warn: true
        }
      });
      this.authenticationService.Logout();
      this.router.navigate(['/login']);
    }
  }

  printLog(event: any) {
    if  (event instanceof HttpResponse || event instanceof HttpErrorResponse) {
      const currentDate = '[' + new Date().toLocaleString() + '] ';
      const logType = event instanceof HttpErrorResponse ? 'ERROR' : 'INFO';
      debugLogging(
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
}
