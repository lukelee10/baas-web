import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  email2 = new FormControl('', [Validators.required, Validators.email]);
  output = {};
  constructor(private awsLambdaService: AwsLambdaService, private route: ActivatedRoute) { }

  ngOnInit() {
    //should be expecting token from path.
    this.route.queryParams.subscribe(params => {
        console.log(params); // {order: "popular"}
        this.output = params;
      });
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' : this.email.hasError('email') ? 'Not a valid email' : '';
  }

  submit() {
    const newCredential = { ...this.output, password: '' };
    newCredential.password = this.email.value;
    this.awsLambdaService.confirmPassword(newCredential);
  }

}
