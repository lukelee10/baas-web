import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {first} from 'rxjs/operators';

import { MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AwsLambdaService } from './../../../core/services/aws-lambda.service';
import { LoaderService } from './../../../shared/services/loader.service';

import { BaaSUser } from './../../../shared/models/user';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})

export class UserManagementComponent implements OnInit {
  pageTitle = 'List Users';
  dataSource: MatTableDataSource<BaaSUser>;
  selection = new SelectionModel<BaaSUser>(true, []);

  displayedColumns: string[] = ['select', 'UserId', 'Fullname', 'Group', 'Role', 'Disabled', 'actions'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter', {static: true}) filter: ElementRef;

  baasUsers: any;
  usersViewModel: BaaSUser[] = [];

  constructor(
    private awsLambdaService: AwsLambdaService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.loaderService.Show('Loading Users...');
    this.awsLambdaService.getUsers()
    .pipe(first())
    .subscribe(
      users => {
        this.baasUsers = users;
        this.getViewModelUsers(users);
        this.dataSource = new MatTableDataSource<BaaSUser>(this.usersViewModel);
        this.dataSource.paginator = this.paginator;
        this.sort.start = 'asc';
        this.dataSource.sort = this.sort;
        this.loaderService.Hide();
      },
      (err) => {
        this.loaderService.Hide();
      }
    );
  }

  private getViewModelUsers(users: any): void {
    for (const item of users.Items) {
      this.usersViewModel.push(
        {
          UserId: item.UserId,
          Fullname: this.getName(item.Firstname, item.Lastname),
          Group: item.Group,
          IsAdmin: item.IsAdmin,
          Role: item.Role,
          Disabled: item.Disabled
        }
      );
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
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BaaSUser): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.UserId + 1}`;
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
}
