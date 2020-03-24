import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.scss']
})
export class UserAgreementComponent implements OnInit {
  disabledAgreement = true;
  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.GetLatestMenuContext(false);
  }

  clickAccept() {
    this.authenticationService.IsAgreementAccepted = true;
    this.authenticationService.setUserLoggedIn(true);
    this.router.navigate(['/announcements']);
    this.userService.GetLatestMenuContext(true);
  }

  clickDecline() {
    this.authenticationService.IsAgreementAccepted = false;
    this.authenticationService.Logout();
    this.router.navigate(['/logout']);
    this.userService.GetLatestMenuContext(false);
  }
  changeCheck(event) {
    this.disabledAgreement = !event.checked;
  }
}
