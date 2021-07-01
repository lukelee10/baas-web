import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { GroupManagementComponent } from './group-management/group-management.component';
import { UserDetailsComponent } from './user-management/user-details/user-details.component';
import { UserManagementComponent } from './user-management/user-management.component';

@NgModule({
  declarations: [
    AdminComponent,
    UserManagementComponent,
    GroupManagementComponent,
    CreateUserComponent,
    UserDetailsComponent
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule],
  entryComponents: [UserDetailsComponent]
})
export class AdminModule {}
