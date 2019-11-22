import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styles: ['.grey-box { background-color: #ECEFF1 ; padding: 15px 60px 60px 150px; min - width: 520px;}']
})
export class ForgotPasswordComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private awsLambdaService: AwsLambdaService,
  ) { }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' : this.email.hasError('email') ? 'Not a valid email' : '';
  }

  submit() {
    this.awsLambdaService.resetPassword(this.email.value);
  }

}
