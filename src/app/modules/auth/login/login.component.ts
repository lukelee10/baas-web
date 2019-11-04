import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { AwsLambdaService } from './../../../core/services/aws-lambda.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  passWord = new FormControl('', [Validators.required]);
  hide = true; // #password
  errorMessage: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationSVC: AuthenticationService,
    private awsLambdaService: AwsLambdaService
  ) { }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :  this.email.hasError('email') ? 'Not a valid email' : '';
  }

  clickLogin() {
    this.authenticationSVC.AuthenticateUser(this.email.value, this.passWord.value, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) {
      // error
      // As per the wireframe, we display all the time 'Unknown User and Password Combination',
      // which is not a good way implementation, but sometimes ...
      this.errorMessage = 'Unknown User and Password Combination';
    } else { // success
      this.setAuthenticationVals(result);
      const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'.toString()];
      if (returnUrl === undefined) {
        this.router.navigate(['/announcements']);
      } else {
        this.router.navigate([returnUrl]);
      }
    }
  }

  private setAuthenticationVals(result: any) {
    this.authenticationSVC.LoggedUser = this.email.value;
    this.authenticationSVC.SetJwtToken = result.getAccessToken().getJwtToken();
    this.awsLambdaService.auditLogin();
  }
}
