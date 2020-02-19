import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  firstname = new FormControl('', [Validators.required]);
  lastname = new FormControl('', [Validators.required]);
  group = new FormControl('', [Validators.required]);
  role = new FormControl('', [Validators.required]);
  disabled = new FormControl('', [Validators.required]);

  errMessage = 'Cannot create new user';

  constructor(
    private awsLambdaService: AwsLambdaService,
    private router: Router,
    public lookupStaticDataService: LookupStaticDataService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  submit() {
    const newUser = {
      user: {
        email: this.email.value,
        temporaryPassword: this.password.value,
        firstname: this.firstname.value,
        lastname: this.lastname.value,
        group: this.group.value,
        role: this.role.value,
        disabled: this.disabled.value,
        admin: false
      }
    };

    if (this.role.value === 'Admin') {
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
        this.notificationService.debugLogging(
          'createUserComponent createUser error',
          error
        );
        // this.notificationService.error(`${this.errMessage}: ${error}`);
      }
    );
  }
}
