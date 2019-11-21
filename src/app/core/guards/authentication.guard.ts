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
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let stateURL: string = state.url;

    if (
      // Authenticated and accepted the agreement -- let the user pass
      this.authenticationService.IsAuthenticated &&
      this.authenticationService.IsAgreementAccepted
    ) {
      return of(true);
    } else if (
      // Authenticated but NOT accepted the agreement -- redirect user only to the agreement page
      this.authenticationService.IsAuthenticated &&
      !this.authenticationService.IsAgreementAccepted
    ) {
      if (stateURL === '/agreements') {
        return of(true);
      } else {
        // Authenticated but NOT accepting the agreement and trying to BYPASS User Agreement-- logout the user and redirect to login page
        this.authenticationService.Logout();
        stateURL = '/agreements';
        this.router.navigate(['/login'], {
          queryParams: {
            returnUrl: stateURL
          }
        });
        return of(false);
      }
    } else if (
      !this.authenticationService.IsAuthenticated &&
      !this.authenticationService.IsAgreementAccepted
    ) {
        // User neither Authenticated nor accepted the agreement -- redirect user to login page
        stateURL = '/agreements';
        this.router.navigate(['/login'], {
          queryParams: {
            returnUrl: stateURL
          }
        });
        return of(false);
      }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(next, state);
  }
}
