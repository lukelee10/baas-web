import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  validateAlphaNumeric,
  validateHas2Case,
  validateNo3Duplicate,
  validateSpecialChar
} from 'src/app/core/app-global-constants';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { LookupStaticDataService } from '../../../shared/services/lookup-static-data.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  form: FormGroup;
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  errMessage = 'Cannot create new user';

  validateNoUserID = (c: FormControl) => {
    return !this.form
      ? null
      : c.value.toLowerCase().includes(this.form.value.email.toLowerCase())
      ? { validateNoUserID: true }
      : null;
  };

  constructor(
    private awsLambdaService: AwsLambdaService,
    private formBuilder: FormBuilder,
    private router: Router,
    public lookupStaticDataService: LookupStaticDataService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(12),
        validateAlphaNumeric,
        validateSpecialChar,
        validateNo3Duplicate,
        validateHas2Case,
        this.validateNoUserID
      ]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      disabled: new FormControl('', [Validators.required])
    });
  }

  submit() {
    const ctl = this.form.controls;
    const newUser = {
      user: {
        email: ctl.email.value,
        temporaryPassword: ctl.password.value,
        firstname: ctl.firstname.value,
        lastname: ctl.lastname.value,
        group: ctl.group.value,
        role: ctl.role.value,
        disabled: ctl.disabled.value,
        admin: false
      }
    };

    if (ctl.role.value === 'Admin') {
      newUser.user.admin = true;
    }
    this.awsLambdaService.createUser(newUser).subscribe(
      (data: any) => {
        this.notificationService.successful(
          'User ' + data.email + ' has been created'
        );
        this.router.navigate(['/admin']);
      },
      error => {
        this.notificationService.error(error);
      }
    );
  }

  cancel() {
    this.router.navigate(['/admin']);
    // console.log('you have cancelled request')
  }

  //   deactivate (component: CreateUserComponent) {
  //     if(component.form.dirty) {
  //       this.cancel();
  //     } else {
  //       this.router.navigate(['/admin']);
  //     }

  //   }
}
