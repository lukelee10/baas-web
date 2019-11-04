import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication.service';





@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.scss']
})
export class UserAgreementComponent implements OnInit {
  constructor(
    private router: Router,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit() {

  }

  clickAccept() {
    console.log('Accept Click');
    this.router.navigate(['/announcements']);
  }

  clickDecline() {
    console.log('Decline Click');
    this.authenticationService.Logout();
    this.router.navigate(['/logout']);
  }
}
