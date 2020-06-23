// TODO Technical Dedt -- Clean the change-password.component.ts
// Reason for adding ViewEncapsulation in import statement
// and encapsulation: ViewEncapsulation.None in @Component are to
// consider the mat-form-field styles from change-password.component.scss
// instead of from styles.scss.  Once we clean the styles.scss,
// we can take out the 'ViewEncapsulation' and 'encapsulation: ViewEncapsulation.None'
// from this file
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { AwsLambdaService } from '../../../core/services/aws-lambda.service';

import { LoaderService } from './../../../shared/services/loader.service';
import { NotificationService } from './../../../shared/services/notification.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordComponent implements OnInit {
  LoggedUser: string;
  currentPwdVisibleOff = true;
  newPwdVisibleOff = true;
  confirmPwdVisibleOff = true;
  changePaaswordFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private awsLambdaService: AwsLambdaService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.LoggedUser = this.authenticationService.LoggedUser;

    this.changePaaswordFormGroup = this.fb.group({
      currentPwd: new FormControl('', [Validators.required]),
      newPwd: new FormControl('', [Validators.required]),
      confirmPwd: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    const formData = this.changePaaswordFormGroup.value;

    this.loaderService.Show('Changing Password...');
    this.awsLambdaService
      .changePassword({
        CurrentPassword: formData.currentPwd,
        NewPassword: formData.newPwd
      })
      .subscribe(
        data => {
          this.loaderService.Hide();
          this.notificationService.successful('Password Changed Sucessfully.');
        },
        error => {
          this.loaderService.Hide();
          this.notificationService.error(error);
        }
      );
  }
}
