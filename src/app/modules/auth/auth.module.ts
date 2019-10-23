import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { LogOutComponent } from './log-out/log-out.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './../../shared/shared.module';


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    LogOutComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
