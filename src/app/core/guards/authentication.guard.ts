import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

/*
 * AuthenticationGuard is a router guard that checks if the user
 * is authenticated.  To check permissions (i.e. roles) use PermissionGuard
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // This only checks if a user is authenticated

    if (this.authenticationService.IsAuthenticated) {
      return of(true);
    } else {
      const stateURL = !this.authenticationService.IsAgreementAccepted  ? '/agreements'    : state.url;
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: stateURL
        }
      });

      return of(false);
    }
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }
}
