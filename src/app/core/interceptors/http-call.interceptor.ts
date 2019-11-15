import 'rxjs/add/operator/do';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

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
          this.printLog(event);
          if (event.status === 401) {
            // session time-out error, redire to login
            this.router.navigate(['/login']);
          }
        }
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // session time-out error, redire to login
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }

  printLog(event) {
    const currentDate = '[' + new Date().toLocaleString() + '] ';
    console.log(
      currentDate +
        ' ' +
        'Event Url:' +
        event.url +
        ' \n status code: ' +
        event.status +
        ' \n status text: ' +
        event.statusText
    );
  }
}
