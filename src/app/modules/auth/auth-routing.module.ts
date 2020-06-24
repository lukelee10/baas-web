import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditProfileComponent } from '../../modules/auth/edit-profile/edit-profile.component';
import { AuthenticationGuard } from './../../core/guards/authentication.guard';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { LogOutComponent } from './log-out/log-out.component';
import { LoginComponent } from './login/login.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

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
        path: 'changepassword',
        canActivate: [AuthenticationGuard],
        component: ChangePasswordComponent
      },
      {
        path: 'forgotpassword',
        component: ForgotPasswordComponent
      },
      {
        path: 'new-password',
        component: NewPasswordComponent
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
export class AuthRoutingModule {}
