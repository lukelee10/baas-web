import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { UserRoles } from '../app-global-constants';
import { UserService } from '../services/user.service';

/*
 * AdminGuard is a router guard that checks if the user is either Admin or Lead.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const srv = this.userService;
    return !srv.IsAdmin && srv.Role !== UserRoles.Lead
      ? this.router.parseUrl('/Unauthorized')
      : true;
  }
}
