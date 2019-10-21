import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { NewUserComponent } from './new-user/new-user.component';
import { UsersManagementComponent } from './users-management/users-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'createuser',
        component: NewUserComponent,
      },
      {
        path: 'usermanagement',
        component: UsersManagementComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
