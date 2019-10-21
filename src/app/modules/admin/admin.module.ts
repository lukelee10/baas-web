import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { NewUserComponent } from './new-user/new-user.component';
import { UsersManagementComponent } from './users-management/users-management.component';


@NgModule({
  declarations: [
    AdminComponent,
    NewUserComponent,
    UsersManagementComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
