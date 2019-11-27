import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppGlobalConstants } from 'src/app/core/app-global-constants';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';

import { NotificationService } from './../../../shared/services/notification.service';

// At least 3 special characters: `~!@#$%^&*()_+-={}|[]\:";'<>?,./
const validateSpecialChar = (c: FormControl) => {
  const ascii = c.value.split('').map(ch => ch.charCodeAt());
  const specialRange = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
     47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126];
  const bag = ascii.filter(ch => specialRange.includes(ch));
  return bag.length >= 3 ? null : { validateSpecialChar: true };
};
const validateAlphaNumeric = (c: FormControl) => {
  const ascii = c.value.split('').map(ch => ch.charCodeAt());
  const digitBag = ascii.filter(ch => (ch >= 48 && ch <= 57));
  const lowerCaseBag = ascii.filter(ch => (ch >= 97 && ch <= 122));
  const upperCaseBag = ascii.filter(ch => (ch >= 65 && ch <= 90));
  return digitBag.length >= 3 && lowerCaseBag.length >= 3
    && upperCaseBag.length >= 3 ? null : { validateAlphaNumeric: true };
};

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(12),
    validateAlphaNumeric,
    validateSpecialChar]);

  password2: FormControl;
  output = {};
  errMessage: string;
  hide = true; // #password
  compare = (c: FormControl) => {
    return c.value === this.password.value ? null : { compare: true };
  }

  constructor(
    private awsLambdaService: AwsLambdaService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService) { }

  ngOnInit() {
    // should be expecting token from path.
    this.password2 = new FormControl('', [Validators.required, this.compare]);
    this.route.queryParams.subscribe(params => {
      this.notificationService.debugLogging(params); // {order: "popular"}
      this.output = params;
    });
  }

  submit() {
    this.errMessage = null;
    const newCredential = { ...this.output, password: '' };
    newCredential.password = this.password.value;
    this.awsLambdaService.confirmPassword(newCredential)
      .subscribe(
        data => {
          this.notificationService.debugLogging('POST Request is successful ', data);
          this.router.navigate(['/login']);
        },
        error => {
          if (error.error.statusCode === AppGlobalConstants.ApplicationError ) {
            this.errMessage =
            'password does not meet criteria, <br>user doe not exist, ' +
            '<br>link is invalid, <br>link is expired, does not exist, ' +
            '<br>user account disabled.';
          }
          this.notificationService.debugLogging('Error', error);
        }
      );
  }

}
