import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toppagenavigation',
  templateUrl: './toppagenavigation.component.html',
  styleUrls: ['./toppagenavigation.component.scss']
})
export class TopPageNavigationComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  navItems = [
    { link: '/requests', title: 'Submit Images', icon: 'create'},
    { link: '/responses', title: 'View Responses', icon: 'receipt' },
    { link: '/resources', title: 'Resources', icon: 'pages' },
    { link: '/admin', title: 'Admin', icon: 'supervisor_account' }
  ];

  constructor() { }

  ngOnInit() {
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
