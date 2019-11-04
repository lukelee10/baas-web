import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from './../../../core/services/authentication.service';

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
    private authenticationSVC: AuthenticationService
  ) { }

  ngOnInit() {
      // temp
      this.email.setValue('admin@baas.devver1');
      this.passWord.setValue('P@ssw0rd123!');
      this.clickLogin();
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
      this.authenticationSVC.IsAuthenticated = true;
      this.authenticationSVC.LoggedUser = this.email.value;

      const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'.toString()];
      if (returnUrl === undefined) {
        this.router.navigate(['/agreements']);
      } else {
        this.router.navigate([returnUrl]);
      }
    }
  }
}
