import 'rxjs/add/operator/do';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';

import { AppGlobalConstants } from './../app-globals';

@Injectable({
  providedIn: 'root'
})
export class HttpCallInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
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
      console.log(
        currentDate + 'Session timedout - Redirecting to Login Page...'
      );
      this.router.navigate(['/login']);
    }
  }

  printLog(event: any) {
    if (
      !environment.production &&
      (event instanceof HttpResponse || event instanceof HttpErrorResponse)
    ) {
      const currentDate = '[' + new Date().toLocaleString() + '] ';
      const logType = (event instanceof HttpErrorResponse) ? 'ERROR' : 'INFO';
      console.log(
        currentDate + logType +
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
