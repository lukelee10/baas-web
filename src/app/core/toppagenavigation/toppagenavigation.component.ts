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

  navItems: NavItem[] = [];

  constructor(
    private router: Router,
    private awsLambdaService: AwsLambdaService,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.populateNavItems();
  }

  private populateNavItems() {
    this.userService.SubscribeLatest.subscribe(onLatest => {
      if (onLatest) {
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
    this.router.navigate(['/logout']);
  }
}
