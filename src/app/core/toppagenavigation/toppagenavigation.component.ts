import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { AwsLambdaService } from '../services/aws-lambda.service';
import { UserService } from '../services/user.service';
import { NavItem } from './../../shared/models/nav-item';

@Component({
  selector: 'app-toppagenavigation',
  templateUrl: './toppagenavigation.component.html',
  styleUrls: ['./toppagenavigation.component.scss']
})
export class TopPageNavigationComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  showMenu = false;

  navItems: NavItem[] = [];

  constructor(
    private router: Router,
    private awsLambdaService: AwsLambdaService,
    public authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.populateNavItems();
  }

  private populateNavItems() {
    this.userService.ShowMenuSubject.subscribe(showFlag => {
      if (showFlag) {
        if (
          this.authenticationService.IsAuthenticated &&
          this.authenticationService.IsAgreementAccepted
        ) {
          this.showMenu = true;
          this.navItems.push({
            link: '/requests',
            title: 'Submit Images',
            icon: 'photo_library'
          });
          if (!this.userService.IsFSPUser) {
            this.navItems.push({
              link: '/responses',
              title: 'View Responses',
              icon: 'receipt'
            });
          }
          this.navItems.push({
            link: '/resources',
            title: 'Resources',
            icon: 'pages'
          });
          if (this.userService.IsAdmin || this.userService.IsLead) {
            this.navItems.push({
              link: '/admin',
              title: 'Admin',
              icon: 'supervisor_account'
            });
          }
        }
      } else {
        this.navItems = [];
        this.showMenu = false;
      }
    });
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };

  LogOut() {
    this.awsLambdaService.auditLog(
      this.authenticationService.LoggedUser,
      'LogOut'
    );
    this.authenticationService.Logout();
    this.userService.GetLatestMenuContext(false);
    this.router.navigate(['/logout']);
  }
}
