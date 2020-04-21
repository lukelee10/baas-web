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

interface User {
  email: string;
  firstname?: string;
  lastname?: string;
  group?: string;
  admin: false;
  role?: string;
  disabled?: boolean;
}

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
      group: new FormControl({ value: Group, disabled: true }),
      // Validators.required disabled fc does not validate
      role: new FormControl(Role, [Validators.required]),
      disabled: new FormControl(Disabled, [Validators.required])
    });
    this.form.controls.group.markAsPristine();
    this.dialogRef.backdropClick().subscribe(_ => {
      const cn = confirm('Changes not saved, are you sure to close?');
      if (cn) {
        this.dialogRef.close();
      }
    });
  }

  submit() {
    const ctl = this.form.controls;
    const userChanges: User = {
      email: ctl.email.value,
      admin: false
    };
    if (ctl.firstname.dirty || ctl.lastname.dirty) {
      userChanges.firstname = ctl.firstname.value;
      userChanges.lastname = ctl.lastname.value;
    }
    if (ctl.group.dirty) {
      userChanges.group = ctl.group.value;
    }
    if (ctl.role.dirty) {
      userChanges.role = ctl.role.value;
    }
    if (ctl.disabled.dirty) {
      userChanges.disabled = ctl.disabled.value;
    }

    this.awsLambdaService.updateUser(userChanges).subscribe(
      (data: string) => {
        this.notificationService.successful(
          `User ${userChanges.email} enabled ${data}`
        );
      },
      error => {
        const detail = error.errorDetail ? `-- ${error.errorDetail}` : '';
        this.notificationService.error(
          `Enabling user failed. ${error} ${detail}`
        );
      }
    );
  }

  cancel() {
    if (this.form.dirty) {
      const cn = confirm('Changes not saved, are you sure to close?');
      if (!cn) {
        return;
      }
    }
    this.dialogRef.close();
  }

  setGroup(node: GroupFlatNode) {
    this.form.controls.group.setValue(node.fqn);
    this.form.controls.group.markAsDirty();
  }
}
