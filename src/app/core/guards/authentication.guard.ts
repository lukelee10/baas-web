import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

export interface FormComponent {
  form: FormGroup;
}
/*
 * AuthenticationGuard is a router guard that checks if the user
 * is authenticated.  To check permissions (i.e. roles) use PermissionGuard
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard
  implements CanActivate, CanActivateChild, CanDeactivate<FormComponent> {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
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
      if (this.userService.IsFSPUser) {
        if (stateURL === '/responses') {
          this.router.navigate(['/Unauthorized'], {
            queryParams: {
              returnUrl: stateURL
            }
          });
          return of(false);
        } else {
          return of(true);
        }
      } else {
        return of(true);
      }
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
