import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = this.authenticationService.LoggedUser;
    const jwtToken = this.authenticationService.JwtToken;
    if (currentUser && jwtToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `${jwtToken}`,
          'X-XSS-Protection': '1; mode=block'
        }
      });
    }

    return next.handle(request);
  }
}
