import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { CreateUserComponent } from './create-user/create-user.component';

const routes: Routes = [
  {
    path: 'newUser',
    component: CreateUserComponent
  },
  {
    path: '',
    component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
