import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenavigation',
  templateUrl: './sidenavigation.component.html',
  styleUrls: ['./sidenavigation.component.scss']
})
export class SideNavigationComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  sideNavItems = [
    { link: '/announcements', title: 'Home', icon: 'home'},
    { link: '/requests', title: 'Submit Images', icon: 'create'},
    { link: '/responses', title: 'View Responses', icon: 'receipt' },
    { link: '/resources', title: 'Resources', icon: 'pages' },
    { link: '/admin', title: 'Admin', icon: 'supervisor_account' },
    { link: '/logout', title: 'Log Out', icon: 'exit_to_app' }
  ];

  constructor() { }

  ngOnInit() {
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
}
