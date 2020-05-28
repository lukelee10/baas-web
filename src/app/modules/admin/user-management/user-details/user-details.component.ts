import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { UserService } from 'src/app/core/services/user.service';
import { BaaSUser } from 'src/app/shared/models/user';
import {
  LookupStaticDataService,
  SelectItem
} from 'src/app/shared/services/lookup-static-data.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { GroupFlatNode } from '../../group-management/group-management.component';
import { LoaderService } from './../../../../shared/services/loader.service';

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
  templateUrl: '../../create-user/create-user.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  form: FormGroup;
  editFlag = true;
  userRolesArr: SelectItem[];

  constructor(
    private awsLambdaService: AwsLambdaService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    public lookupStaticDataService: LookupStaticDataService,
    private notificationService: NotificationService,
    public userService: UserService,
    public dialogRef: MatDialogRef<UserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public user: BaaSUser
  ) {}

  ngOnInit() {
    this.userRolesArr = this.userService.IsAdmin
      ? this.lookupStaticDataService.userRoleData
      : this.lookupStaticDataService.userRoleData.filter(
          userRole => userRole.value !== 'Admin'
        );

    const {
      username,
      firstname,
      lastname,
      group,
      role,
      isDisabled = false
    } = this.user;
    this.form = this.formBuilder.group({
      email: new FormControl({ value: username, disabled: true }),
      firstname: new FormControl(firstname, [Validators.required]),
      lastname: new FormControl(lastname, [Validators.required]),
      group: new FormControl({ value: group, disabled: true }),
      // Validators.required disabled fc does not validate
      role: new FormControl(role, [Validators.required]),
      disabled: new FormControl(isDisabled, [Validators.required])
    });
    this.form.controls.group.markAsPristine();
    this.dialogRef.backdropClick().subscribe(_ => {
      if (this.form.dirty) {
        const cn = confirm('Changes not saved, are you sure to close?');
        if (cn) {
          this.dialogRef.close();
        }
      } else {
        this.dialogRef.close();
      }
    });
  }

  submit() {
    this.loaderService.Show('Saving User...');
    const ctl = this.form.controls;
    const userChanges: User = {
      email: ctl.email.value,
      admin: false
    };
    const phrases = [];
    if (ctl.firstname.dirty || ctl.lastname.dirty) {
      userChanges.firstname = ctl.firstname.value;
      userChanges.lastname = ctl.lastname.value;
      phrases.push('name');
    }
    if (ctl.group.dirty) {
      userChanges.group = ctl.group.value;
      phrases.push('group');
    }
    if (ctl.role.dirty) {
      userChanges.role = ctl.role.value;
      phrases.push('role');
    }
    const pString =
      phrases.length === 0
        ? ' has no changes'
        : `has changed ${phrases.join(', ')}`;
    let dString = '';
    if (ctl.disabled.dirty) {
      userChanges.disabled = ctl.disabled.value;
      dString = `, and ${
        userChanges.disabled ? 'has been disabled' : 'has been enabled'
      }`;
    }

    const promises = [];
    if (userChanges.firstname) {
      promises.push(
        this.awsLambdaService.updateUserName(userChanges).toPromise()
      );
    }
    const { group, role, disabled } = userChanges;
    if (group !== undefined || role !== undefined || disabled !== undefined) {
      promises.push(this.awsLambdaService.updateUser(userChanges).toPromise());
    }

    Promise.all(promises).then(
      _ => {
        this.loaderService.Hide();
        this.notificationService.successful(
          `User ${userChanges.email} ${pString} ${dString}`
        );
        // pass the user-changes back out.
        this.dialogRef.close(userChanges);
      },
      error => {
        this.loaderService.Hide();
        const detail = error.errorDetail ? `-- ${error.errorDetail}` : '';
        this.notificationService.error(
          `Updating user failed. ${error} ${detail}`
        );
      }
    );
  }

  cancel() {
    if (this.form.dirty) {
      const cn = confirm('Changes not saved, are you sure to close?');
      if (cn) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }

  setGroup(node: GroupFlatNode) {
    this.form.controls.group.setValue(node.fqn);
    this.form.controls.group.markAsDirty();
  }
}
