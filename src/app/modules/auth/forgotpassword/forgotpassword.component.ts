import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  AppMessage,
  AppMessagesService
} from 'src/app/core/services/app-messages.service';

import { AwsLambdaService } from './../../../core/services/aws-lambda.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { NotificationService } from './../../../shared/services/notification.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  message: string;
  errorMessage: string;
  constructor(
    private awsLambdaService: AwsLambdaService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private appMessagesService: AppMessagesService
  ) {}

  ngOnInit() {}

  getErrorMessage() {
    return this.email.hasError('required')
      ? 'You must enter a value'
      : this.email.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  submit() {
    this.loaderService.Show('Sending Reset password request...');
    this.notificationService.setPopUpTitle('BaaS - Forgot Password');

    this.awsLambdaService.resetPassword(this.email.value).subscribe(
      data => {
        this.loaderService.Hide();
        this.notificationService.debugLogging(
          'POST Request is successful',
          data
        );
        this.message = this.appMessagesService.getMessage(
          AppMessage.PasswordResetSubmission
        );
      },
      error => {
        this.loaderService.Hide();
        this.errorMessage =
          'Having trouble making the reset password request, please try later.';
        this.notificationService.debugLogging('Error', error);
      }
    );
  }
}
