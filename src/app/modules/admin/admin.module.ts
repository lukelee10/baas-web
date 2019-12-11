import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from './../../shared/shared.module';

import { AdminComponent } from './admin.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { GroupManagementComponent } from './group-management/group-management.component';
import { CreateUserComponent } from './create-user/create-user.component';

@NgModule({
  declarations: [
    AdminComponent,
    UserManagementComponent,
    GroupManagementComponent,
    CreateUserComponent
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule]
})
export class AdminModule {}
