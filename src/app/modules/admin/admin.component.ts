import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

import { GroupManagementComponent } from './group-management/group-management.component';
import { UserManagementComponent } from './user-management/user-management.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @ViewChild(UserManagementComponent, { static: true })
  private userManagementComponent: UserManagementComponent;
  @ViewChild(GroupManagementComponent, { static: true })
  private groupManagementComponent: GroupManagementComponent;

  constructor() {}

  ngOnInit() {}

  tabClick(tab: MatTabChangeEvent) {
    if (tab.index === 0) {
      // refresh the user list
      this.userManagementComponent.getUsers();
    } else {
      // refresh the org list
      this.groupManagementComponent.getOrgs();
    }
  }
}
