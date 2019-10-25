import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';

import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { LogOutComponent } from './log-out/log-out.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    LogOutComponent,
    EditProfileComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
