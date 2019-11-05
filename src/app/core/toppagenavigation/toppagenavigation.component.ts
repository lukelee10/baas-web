import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AwsLambdaService } from '../services/aws-lambda.service';
import { AuthenticationService } from '../services/authentication.service';

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
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.populateNavItems();
  }

  private populateNavItems() {
    this.navItems.push({link: '/requests', title: 'Submit Images', icon: 'create'});
    this.navItems.push({link: '/responses', title: 'View Responses', icon: 'receipt'});
    this.navItems.push({link: '/resources', title: 'Resources', icon: 'pages'});

    if (this.authenticationService.isAdmin) {
      this.navItems.push({link: '/admin', title: 'Admin', icon: 'supervisor_account'});
    }
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  LogOut() {
    this.awsLambdaService.auditLog(this.authenticationService.LoggedUser, 'LogOut');
    this.authenticationService.Logout();
    this.router.navigate(['/logout']);
  }
}
