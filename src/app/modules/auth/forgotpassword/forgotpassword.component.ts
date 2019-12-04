import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { AwsLambdaService } from './../../../core/services/aws-lambda.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { NotificationService } from './../../../shared/services/notification.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styles: ['.grey-box { background-color: #ECEFF1 ; padding: 15px 60px 60px 150px; min - width: 520px;}']
})

export class ForgotPasswordComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  message: string;
  errorMessage: string;
  constructor(
    private awsLambdaService: AwsLambdaService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' : this.email.hasError('email') ? 'Not a valid email' : '';
  }

  submit() {
    this.loaderService.Show('Sending Reset password request...');
    this.notificationService.setPopUpTitle('BaaS - Forgot Password');

    this.awsLambdaService.resetPassword(this.email.value)
      .subscribe( data => {
        this.loaderService.Hide();
        this.notificationService.notify('Reset password request successful !!!');
        this.notificationService.debugLogging('POST Request is successful', data);
      }, error => {
        this.loaderService.Hide();
        this.errorMessage = 'Having trouble making the reset password request, please try later.';
        this.notificationService.debugLogging('Error', error);
      });
  }
}
