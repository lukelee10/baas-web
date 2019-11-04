import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

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
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.populateSideNavItems();
  }

  private populateSideNavItems() {
    this.sideNavItems.push({ link: '/announcements', title: 'Home', icon: 'home'});
    this.sideNavItems.push({ link: '/requests', title: 'Submit Images', icon: 'create'});
    this.sideNavItems.push({ link: '/responses', title: 'View Responses', icon: 'receipt'});
    this.sideNavItems.push({ link: '/resources', title: 'Resources', icon: 'pages'});

    if (this.authenticationService.isAdmin) {
      this.sideNavItems.push({ link: '/admin', title: 'Admin', icon: 'supervisor_account'});
    }

    this.sideNavItems.push({ link: '/editprofile', title: 'Edit Profile', icon: 'edit'});
    this.sideNavItems.push({ link: '/logout', title: 'Log Out', icon: 'exit_to_app'});
  }

  public onSidenavClose = (elementTitle: any) => {
    this.sidenavClose.emit();

    if (elementTitle === 'Log Out') {
      this.authenticationService.Logout();
      this.router.navigate(['/logout']);
    }
  }
}
