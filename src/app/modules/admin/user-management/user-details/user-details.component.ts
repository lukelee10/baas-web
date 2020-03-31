import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { BaaSUser } from 'src/app/shared/models/user';
import { LookupStaticDataService } from 'src/app/shared/services/lookup-static-data.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { GroupFlatNode } from '../../group-management/group-management.component';

@Component({
  selector: 'app-user-details',
  templateUrl: '../../create-user/create-user.component.html'
})
export class UserDetailsComponent implements OnInit {
  form: FormGroup;

  editFlag = true;

  constructor(
    private awsLambdaService: AwsLambdaService,
    private formBuilder: FormBuilder,
    public lookupStaticDataService: LookupStaticDataService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<UserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public user: BaaSUser
  ) {}

  ngOnInit() {
    const {
      UserId,
      Firstname,
      Lastname,
      Group,
      Role,
      Disabled = false
    } = this.user;
    this.form = this.formBuilder.group({
      email: new FormControl({ value: UserId, disabled: true }),
      firstname: new FormControl(Firstname, [Validators.required]),
      lastname: new FormControl(Lastname, [Validators.required]),
      group: new FormControl({ value: '', disabled: true }, [
        Validators.required
      ]),
      role: new FormControl(Role, [Validators.required]),
      disabled: new FormControl(Disabled, [Validators.required])
    });
  }

  // TODO next story will be implementing the submit edit changes
  // submit() {
  //   const ctl = this.form.controls;
  //   const newUser = {
  //     user: {
  //       email: ctl.email.value,
  //       temporaryPassword: ctl.password.value,
  //       firstname: ctl.firstname.value,
  //       lastname: ctl.lastname.value,
  //       group: ctl.group.value,
  //       role: ctl.role.value,
  //       disabled: ctl.disabled.value,
  //       admin: false
  //     }
  //   };

  // the work on saving is on a different ticket
  // if (ctl.role.value === 'Admin') {
  //   newUser.user.admin = true;
  // }
  // this.awsLambdaService.createUser(newUser).subscribe(
  //   (data: any) => {
  //     this.notificationService.successful(
  //       'User ' + data.email + ' has been created'
  //     );
  //   },
  //   error => {
  //     this.notificationService.error(error);
  //   }
  // );
  // }

  setGroup(node: GroupFlatNode) {
    this.form.controls.group.setValue(node.fqn);
  }
}
