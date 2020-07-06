import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatSlideToggleChange
} from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { LookupStaticDataService } from 'src/app/shared/services/lookup-static-data.service';

import { AwsLambdaService } from './../../../core/services/aws-lambda.service';
import { UserService } from './../../../core/services/user.service';
import { BaaSUser } from './../../../shared/models/user';
import { LoaderService } from './../../../shared/services/loader.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { UserDetailsComponent } from './user-details/user-details.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  pageTitle = 'List Users';
  dataSource: MatTableDataSource<BaaSUser>;
  selection = new SelectionModel<BaaSUser>(true, []);

  detailsPopup: MatDialogRef<UserDetailsComponent, any>;

  displayedColumns: string[] = [
    'select',
    'username',
    'fullname',
    'group',
    'role',
    'isDisabled',
    'actions'
  ];
  // role maps value to label
  roleMap = new Map<string, string>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  usersViewModel: BaaSUser[] = [];

  constructor(
    private awsLambdaService: AwsLambdaService,
    private userService: UserService,
    private loaderService: LoaderService,
    public lookupStaticDataService: LookupStaticDataService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getUsers();
    this.lookupStaticDataService.userRoleData.forEach(tup => {
      this.roleMap.set(tup.value, tup.label);
    });
  }

  getUsers(): void {
    this.loaderService.Show('Loading Users...');
    this.notificationService.setPopUpTitle('BaaS - Get Users');
    let sub;
    if (this.userService.IsAdmin || this.userService.IsLead) {
      sub = this.awsLambdaService.getUsers();
    } else {
      sub = null;
    }
    if (sub) {
      sub.pipe(first()).subscribe(
        users => {
          this.getViewModelUsers(users);
          this.dataSource = new MatTableDataSource<BaaSUser>(
            this.usersViewModel
          );
          this.dataSource.paginator = this.paginator;
          this.sort.start = 'asc';
          this.dataSource.sort = this.sort;
          this.loaderService.Hide();
          // this.notificationService.notify('Successful !!!');
        },
        error => {
          this.loaderService.Hide();
        }
      );
    }
  }

  private getViewModelUsers(users: BaaSUser[]): void {
    for (const item of users) {
      item.fullname = this.getName(item.firstname, item.lastname);
      item.group = item.group._GUID;
      this.usersViewModel.push(item);
    }
  }

  applyFilter(filterValue: string) {
    if (filterValue !== null) {
      filterValue = filterValue.trim().toLowerCase();
    }

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows = 0;
    if (this.dataSource) {
      numRows = this.dataSource.data.length;
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BaaSUser): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.username + 1}`;
  }

  ClearFilter() {
    this.filter.nativeElement.value = '';
    this.applyFilter('');
  }

  private getName(firstName: string, lastName: string): string {
    let name = '';
    if (firstName && lastName) {
      name = firstName + ' ' + lastName;
    } else if (firstName && !lastName) {
      name = firstName;
    } else if (!firstName && lastName) {
      name = lastName;
    }

    return name;
  }

  toggleDisable(event: MatSlideToggleChange, user: BaaSUser): void {
    console.log('toggleDisable ', event); // event.checked
    // user.Disabled = !user.Disabled;
    // need to save to save to API
    const userChanges = {
      email: user.username,
      disabled: event.checked,
      admin: null
    };
    this.awsLambdaService.updateUser(userChanges).subscribe(
      (data: string) => {
        this.notificationService.successful(
          `User ${user.username} has been ${
            event.checked ? 'disabled' : 'enabled'
          }`
        );
      },
      error => {
        user.isDisabled = !event.checked;
        const detail = error.errorDetail ? `-- ${error.errorDetail}` : '';
        this.notificationService.error(
          `${
            event.checked ? 'Disabling' : 'Enabling'
          } user failed. ${error} ${detail}`
        );
      }
    );
  }

  openDialog(request: BaaSUser): void {
    const dialogRef = (this.detailsPopup = this.dialog.open(
      UserDetailsComponent,
      {
        width: '900px',
        height: '700px',
        data: request,
        disableClose: true
      }
    ));

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if (!result) {
        return;
      }
      const { disabled, group, role, firstname, lastname } = result;
      if (disabled !== undefined) {
        request.isDisabled = disabled;
      }
      if (group) {
        request.group = group;
      }
      if (role) {
        request.role = role;
      }
      if (firstname) {
        request.firstname = firstname;
        request.lastname = lastname;
        request.fullname = this.getName(firstname, lastname);
      }
    });
  }

  reloadControl(): void {
    window.location.reload();
  }
}
