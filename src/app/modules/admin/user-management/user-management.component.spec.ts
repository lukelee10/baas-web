import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggle } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserRoles } from 'src/app/core/app-global-constants';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { AwsLambdaServiceMock } from 'src/app/core/services/aws-lambda.service.spec';
import { UserService } from 'src/app/core/services/user.service';
import { BaaSUser } from 'src/app/shared/models/user';
import { SharedModule } from 'src/app/shared/shared.module';

import { GroupManagementComponent } from '../group-management/group-management.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserManagementComponent } from './user-management.component';

// Mock the SortService class, its method and return it with mock data
class MockUserService extends UserService {
  userID = 'admin';
  InitializeUserSession(email: string) {
    this.userID = email;
  }
  get Role(): string {
    return this.userID === 'admin'
      ? UserRoles.Admin
      : this.userID === 'lead'
      ? UserRoles.Lead
      : UserRoles.FSPUser;
  }
  get UserId(): string {
    return 'admin@baas.devver1';
  }
  get Group(): string {
    return 'DEFAULT';
  }
}

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, HttpClientTestingModule],
      declarations: [
        UserManagementComponent,
        UserDetailsComponent,
        GroupManagementComponent
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [UserDetailsComponent]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getUsers correctly as Admin user', () => {
    component.getUsers();
    expect(component.usersViewModel.length).toBeGreaterThan(0);
  });
  it('should filter correctly as Admin user', () => {
    component.applyFilter('test1');
    expect(component.dataSource.filter).toEqual('test1');
  });
  it('should clear fitler correctly as Admin user', () => {
    component.ClearFilter();
    fixture.detectChanges();
    expect(component.dataSource.filter).toEqual('');
  });
  it('should toggle user selection correctly', () => {
    component.masterToggle();
    expect(component.dataSource.data[0]).toBeTruthy();
  });
  it('should disable user correctly', () => {
    spyOn(AwsLambdaServiceMock, 'deleteUser').and.callThrough();

    const componentDebug = fixture.debugElement;
    const slider = componentDebug.query(By.directive(MatSlideToggle));

    slider.triggerEventHandler('change', { checked: true }); // triggerEventHandler
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(AwsLambdaServiceMock.deleteUser).toHaveBeenCalled();
      expect(component.usersViewModel[0].Disabled).toBeTruthy(); // event has been called
    });
  });
  it('should enable user correctly', () => {
    spyOn(AwsLambdaServiceMock, 'updateUser').and.callThrough();

    const componentDebug = fixture.debugElement;
    const slider = componentDebug.query(By.directive(MatSlideToggle));

    slider.triggerEventHandler('change', { checked: false }); // triggerEventHandler
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(AwsLambdaServiceMock.updateUser).toHaveBeenCalled();
      expect(component.usersViewModel[0].Disabled).toBeFalsy(); // event has been called
    });
  });
  it('should open edit dialog on user correctly', () => {
    const user: BaaSUser = {
      UserId: 'test@test.gov',
      Fullname: 'Test Lead',
      Firstname: 'Test',
      Lastname: 'Lead',
      Group: 'ORG/Grp1/Grp11',
      IsAdmin: false,
      Role: 'Lead',
      Disabled: false
    };

    expect(
      fixture.debugElement.nativeNode.parentElement.querySelector(
        'mat-dialog-container'
      )
    ).toBeFalsy();
    component.openDialog(user);
    fixture.whenStable().then(() => {
      expect(
        fixture.debugElement.nativeNode.parentElement.querySelector(
          'mat-dialog-container'
        )
      ).toBeTruthy();
    });
  });
  it('should getUsers correctly as Lead user', () => {
    const userService = TestBed.get(UserService);
    userService.InitializeUserSession('lead');
    component.getUsers();
    expect(component.usersViewModel.length).toBeGreaterThan(0);
  });
  it('should not getUsers correctly as FSP user', () => {
    const userService = TestBed.get(UserService);
    component.usersViewModel.splice(0, component.usersViewModel.length);
    userService.InitializeUserSession('fsp');
    component.getUsers();
    expect(component.usersViewModel.length).toEqual(0);
  });
});
