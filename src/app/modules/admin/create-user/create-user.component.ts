import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  errMessage = 'Cannot create new user';

  constructor(
    private awsLambdaService: AwsLambdaService,
    private router: Router,
    public lookupStaticDataService: LookupStaticDataService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
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
}
