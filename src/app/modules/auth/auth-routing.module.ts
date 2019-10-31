import { AuthenticationGuard } from './../../core/guards/authentication.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProfileComponent } from '../../modules/auth/edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { LogOutComponent } from './log-out/log-out.component';

const authRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'editprofile',
        canActivate: [AuthenticationGuard],
        component: EditProfileComponent
      },
      {
        path: 'forgotpassword',
        canActivate: [AuthenticationGuard],
        component: ForgotPasswordComponent
      },
      {
        path: 'logout',
        component: LogOutComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
