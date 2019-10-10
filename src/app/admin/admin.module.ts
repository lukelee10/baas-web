import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NewUserComponent } from './new-user/new-user.component';
import { UsersMgmtComponent } from './users-mgmt/users-mgmt.component';

@NgModule({
  declarations: [UsersMgmtComponent, NewUserComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AdminModule { }
