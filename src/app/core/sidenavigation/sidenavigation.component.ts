import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { AwsLambdaService } from '../services/aws-lambda.service';
import { UserService } from '../services/user.service';
import { NavItem } from './../../shared/models/nav-item';

@Component({
  selector: 'app-sidenavigation',
  templateUrl: './sidenavigation.component.html',
  styleUrls: ['./sidenavigation.component.scss']
})
export class SideNavigationComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  sideNavItems: NavItem[] = [];

  constructor(
    private router: Router,
    private awsLambdaService: AwsLambdaService,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.populateSideNavItems();
  }

  private populateSideNavItems() {
    this.userService.SubscribeLatest.subscribe(onLatest => {
      if (onLatest) {
        this.sideNavItems.push({
          link: '/announcements',
          title: 'Home',
          icon: 'home'
        });
        this.sideNavItems.push({
          link: '/requests',
          title: 'Submit Images',
          icon: 'photo_library'
        });
        if (!this.userService.IsFSPUser) {
          this.sideNavItems.push({
            link: '/responses',
            title: 'View Responses',
            icon: 'receipt'
          });
        }

        this.sideNavItems.push({
          link: '/resources',
          title: 'Resources',
          icon: 'pages'
        });
        if (this.userService.IsAdmin && !this.userService.IsFSPUser) {
          this.sideNavItems.push({
            link: '/admin',
            title: 'Admin',
            icon: 'supervisor_account'
          });
        }
        this.sideNavItems.push({
          link: '/editprofile',
          title: 'Edit Profile',
          icon: 'edit'
        });
        this.sideNavItems.push({
          link: '/logout',
          title: 'Log Out',
          icon: 'exit_to_app'
        });
      }
    });
  }

  public onSidenavClose = (elementTitle: any) => {
    this.sidenavClose.emit();

    if (elementTitle === 'Log Out') {
      this.awsLambdaService.auditLog(
        this.authenticationService.LoggedUser,
        'LogOut'
      );
      this.authenticationService.Logout();
      this.router.navigate(['/logout']);
    }
  };
}
