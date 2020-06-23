// TODO Technical Dedt -- Clean the change-password.component.ts
// Reason for adding ViewEncapsulation in import statement
// and encapsulation: ViewEncapsulation.None in @Component are to
// consider the mat-form-field styles from login.component.scss
// instead of from styles.scss.  Once we clean the styles.scss,
// we can take out the 'ViewEncapsulation' and 'encapsulation: ViewEncapsulation.None'
// from this file
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import {
  AppGlobalConstants,
  PasswordValidators
} from 'src/app/core/app-global-constants';

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
  changePasswordFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private awsLambdaService: AwsLambdaService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.LoggedUser = this.authenticationService.LoggedUser;

    const newPasswordValidators = [
      Validators.required,
      Validators.minLength(AppGlobalConstants.MinPasswordLength),
      PasswordValidators.buildForbiddenUserIdValidator(this.LoggedUser),
      ...PasswordValidators.CharClassValidators
    ];

    this.changePasswordFormGroup = this.fb.group(
      {
        currentPwd: new FormControl('', [Validators.required]),
        newPwd: new FormControl('', newPasswordValidators),
        confirmPwd: new FormControl('', [Validators.required])
      },
      {
        validators: this.buildFormValidators()
      }
    );
  }

  onSubmit() {
    const formData = this.changePasswordFormGroup.value;

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

  buildFormValidators(): Array<ValidatorFn> {
    const aValidators = [];
    const validateCheckConfirmPassword = (
      group: FormGroup
    ): ValidationErrors | null => {
      const { newPwd, confirmPwd } = group.controls;
      const sErrName = 'validateCheckConfirmPassword';
      const oErrMsg = {
        [sErrName]: 'Values must be identical'
      };

      const bDoNotMatch = newPwd.value !== confirmPwd.value;
      const bHasError = confirmPwd.errors && confirmPwd.errors[sErrName];
      if (bDoNotMatch && !bHasError) {
        const newErrors = Object.create(confirmPwd.errors || {});
        Object.assign(newErrors, oErrMsg);
        confirmPwd.setErrors(newErrors);
      } else if (!bDoNotMatch && bHasError) {
        delete confirmPwd.errors[sErrName];
        if (Object.keys(confirmPwd.errors).length === 0) {
          confirmPwd.setErrors(null);
        }
      }
      return;
    };
    aValidators.push(validateCheckConfirmPassword);

    const validateCurrentIsNotNewPassword = (
      group: FormGroup
    ): ValidationErrors | null => {
      const { currentPwd, newPwd } = group.controls;
      const sErrName = 'validateCurrentIsNotNewPassword';
      const oErrMsg = {
        [sErrName]: 'Values cannot be identical'
      };

      const bPwdsMatch = newPwd.value === currentPwd.value;
      const bHasError = newPwd.errors && newPwd.errors[sErrName];
      if (bPwdsMatch && !bHasError) {
        const newErrors = Object.create(newPwd.errors || {});
        Object.assign(newErrors, oErrMsg);
        newPwd.setErrors(newErrors);
      } else if (!bPwdsMatch && bHasError) {
        delete newPwd.errors[sErrName];
        if (Object.keys(newPwd.errors).length === 0) {
          newPwd.setErrors(null);
        }
      }
      return;
    };
    aValidators.push(validateCurrentIsNotNewPassword);
    return aValidators;
  }
}
