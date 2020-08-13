import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  MatCheckboxChange,
  MatDialog,
  MatDialogRef,
  MatSlideToggleChange
} from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { LookupStaticDataService } from 'src/app/shared/services/lookup-static-data.service';

import { AwsLambdaService } from './../../../core/services/aws-lambda.service';
import { UserService } from './../../../core/services/user.service';
import { ConfirmationDialogComponent } from './../../../shared/components/confirmation-dialog/confirmation-dialog.component';
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
  showSpinner = false;
  pageTitle = 'List Users';
  dataSource: MatTableDataSource<BaaSUser>;
  selection = new SelectionModel<BaaSUser>(true, []);

  detailsPopup: MatDialogRef<
    UserDetailsComponent | ConfirmationDialogComponent,
    any
  >;

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
          this.dataSource = new MatTableDataSource<BaaSUser>(
            this.getViewModelUsers(users)
          );
          this.dataSource.paginator = this.paginator;
          this.sort.start = 'asc';
          this.dataSource.sort = this.sort;
          this.loaderService.Hide();
        },
        error => {
          this.loaderService.Hide();
        }
      );
    }
  }

  private getViewModelUsers(users: BaaSUser[]): BaaSUser[] {
    return users.map(item => {
      item.fullname = this.getName(item.firstname, item.lastname);
      item.group = item.group._GUID;
      return item;
    });
  }

  applyFilter(val: string) {
    this.dataSource.filter = val !== null ? val.trim().toLowerCase() : val;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  clearFilter() {
    this.filter.nativeElement.value = '';
    this.applyFilter('');
  }

  private getInPageRows(): BaaSUser[] {
    const { sortData, filteredData, sort, paginator } = this.dataSource;
    const { pageIndex, pageSize } = paginator;
    return sortData(filteredData, sort).slice(
      pageSize * pageIndex,
      pageSize * (pageIndex + 1)
    );
  }
  /**  find any unselected in page. */
  isAllSelectedInPage(): boolean {
    if (!this.selection.hasValue() || !this.dataSource) {
      return false;
    }
    return (
      this.getInPageRows().find(row => !this.selection.isSelected(row)) ===
      undefined
    );
  }
  isOnlySomeSelectedInPage(): boolean {
    if (!this.selection.hasValue() || !this.dataSource) {
      return false;
    }
    const sett = this.getInPageRows();
    return (
      sett.find(row => this.selection.isSelected(row)) !== undefined &&
      sett.find(row => !this.selection.isSelected(row)) !== undefined
    );
  }
  isAnySelectedInPage(): boolean {
    if (!this.selection.hasValue() || !this.dataSource) {
      return false;
    }
    const sett = this.getInPageRows();
    return sett.find(row => this.selection.isSelected(row)) !== undefined;
  }

  masterToggle(e?: MatCheckboxChange) {
    if (!e) {
      return;
    }
    console.log('inside masterToggle', e);
    if (e.source.indeterminate) {
      this.selection.clear();
      e.source.checked = false;
    } else if (!e.checked) {
      this.selection.clear();
    } else {
      const sett = this.getInPageRows();
      sett.forEach(row => this.selection.select(row));
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BaaSUser): string {
    if (!row) {
      return `${this.isAnySelectedInPage() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.username + 1}`;
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
  disableSelectedUsers(orDisable: boolean = true) {
    if (this.selection.selected.length === 0) {
      return;
    }
    const updateUsers = (action: string) => {
      this.showSpinner = true;
      // https://medium.com/better-programming/rxjs-error-handling-with-forkjoin-3d4027df70fc
      forkJoin(
        this.selection.selected.map(user => {
          const userChanges = { email: user.username, disabled: orDisable };
          return this.awsLambdaService.updateUser(userChanges).pipe(
            map(value => {
              console.log('inside map', user, value);
              user.isDisabled = orDisable;
              return { isError: false, user };
            }),
            catchError(error => of({ isError: true, error, user }))
          );
        })
      ).subscribe(
        values => {
          this.showSpinner = false;
          console.log('result of forkJoing', values);
          const numOfError = values.filter(v => v.isError).length;
          if (numOfError === values.length) {
            this.notificationService.error(`All user ${action} failed`);
          } else if (numOfError > 0) {
            this.notificationService.warning(
              `Only some of the users have been ${action}d`
            );
          } else {
            this.notificationService.successful(
              `All users have been ${action}d`
            );
          }
        },
        error => {
          this.showSpinner = false;
          console.error(`${action} all failed: %j`, error);
          const detail = error.errorDetail ? `-- ${error.errorDetail}` : '';
          this.notificationService.error(`${action} all failed.`);
        }
      );
    };

    if (orDisable) {
      this.detailsPopup = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirm Disable',
          message: 'Are you sure you want to disable the selected users?'
        }
      });
      this.detailsPopup.afterClosed().subscribe(confirmResult => {
        if (confirmResult) {
          updateUsers('disable');
        }
      });
    } else {
      updateUsers('enable');
    }
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
}
