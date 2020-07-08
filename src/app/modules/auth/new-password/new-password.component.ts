import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppGlobalConstants } from 'src/app/core/app-global-constants';
import { PasswordValidators } from 'src/app/core/app-global-utils';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';

import { LoaderService } from './../../../shared/services/loader.service';
import { NotificationService } from './../../../shared/services/notification.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  password: FormControl;
  password2: FormControl;
  output: any = { userid: '' };
  errMessage: string;
  hide = true; // #password
  compare = (c: FormControl) => {
    const notMyPwd =
      this.password && [this.password, this.password2].find(cc => c !== cc);
    if (c && (!c.value || !notMyPwd.value)) {
      return null;
    }
    return c.value === (notMyPwd ? notMyPwd.value : '')
      ? null
      : { compare: true };
  };

  validateNoUserID = (c: FormControl) =>
    c.value
      .toLowerCase()
      .includes(this.output ? this.output.userid.toLowerCase() : '')
      ? { validateNoUserID: true }
      : null;

  constructor(
    private awsLambdaService: AwsLambdaService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    // should be expecting token from path.
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(AppGlobalConstants.MinPasswordLength),
      this.validateNoUserID,
      this.compare,
      ...PasswordValidators.CharClassValidators
    ]);
    this.password2 = new FormControl('', [Validators.required, this.compare]);
    this.route.queryParams.subscribe(params => {
      this.notificationService.debugLogging(params); // {order: "popular"}
      this.output = params;
    });
  }

  submit() {
    this.loaderService.Show('Sending Reset password request...');
    this.notificationService.setPopUpTitle('BaaS - Setting New Password');

    this.errMessage = null;
    const newCredential = { ...this.output, password: '' };
    newCredential.password = this.password.value;
    this.awsLambdaService.confirmPassword(newCredential).subscribe(
      data => {
        this.loaderService.Hide();
        this.notificationService.notify('Successfully changed password!');
        this.notificationService.debugLogging(
          'POST Request is successful ',
          data
        );
        this.router.navigate(['/login']);
      },
      error => {
        this.loaderService.Hide();
        if (error.error.statusCode === AppGlobalConstants.ApplicationError) {
          this.errMessage = 'New password is not accepted';
        }
        this.notificationService.debugLogging('Error', error);
      }
    );
  }
}
