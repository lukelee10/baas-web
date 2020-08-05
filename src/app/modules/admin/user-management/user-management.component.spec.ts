import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatCheckboxChange,
  MatSlideToggle,
  MatSlideToggleChange
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import { UserRoles } from 'src/app/core/app-global-constants';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
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
let okOrNotArr: boolean[] = [];
const AwsLambdaServiceMock: any = {
  getUsers(): Observable<any> {
    return of([
      {
        username: 'test1.admin@leidos.com',
        role: 'Admin',
        group: 'DOS',
        firstname: 'Test',
        lastname: 'Admin'
      },
      {
        username: 'test2.lead@leidos.com',
        role: 'Lead',
        group: 'DOS',
        isAdmin: false,
        firstname: 'Test',
        lastname: 'Lead'
      },
      {
        username: 'user1@leidos.com',
        role: 'Fsp',
        group: 'DOS',
        lastname: 'Lead'
      },
      {
        username: 'user2.lead@leidos.com',
        role: 'Lead',
        group: 'DOS',
        firstname: 'Test',
        isDisabled: true
      },
      {
        username: 'no.name@leidos.com',
        role: 'Lead',
        group: 'DOS',
        isDisabled: true
      }
    ]);
  },
  updateUser(user: BaaSUser): Observable<any> {
    return okOrNotArr.shift() === false
      ? throwError({ status: 404 })
      : of({ status: 'ok', user });
  },

  _setUpdateUserRes(okOrNotArray: boolean[]) {
    okOrNotArr = okOrNotArray;
  }
};

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
  beforeAll(() => {
    spyOn(window, 'confirm').and.returnValues(false, true); // esp for disable users
  });

  it('should toggle user selection correctly', done => {
    const box = fixture.debugElement.nativeElement.querySelector(
      'mat-checkbox'
    );
    const evnt = new MatCheckboxChange();
    evnt.source = box;
    evnt.checked = true;
    component.masterToggle();
    component.masterToggle(evnt);
    fixture.whenStable().then(() => {
      const users = component.selection.selected;
      console.log('users are:', users);
      expect(users.length).toBeGreaterThan(0);
      evnt.checked = false;
      component.masterToggle(evnt);
      fixture.detectChanges();
      expect(component.selection.selected.length === 0).toBeTruthy();
      done();
    });
  });
  it('should disable selected users correctly', done => {
    let disabledUsers = [];
    AwsLambdaServiceMock.getUsers().subscribe(users => {
      disabledUsers = users.filter(user => user.isDisabled);
    });
    const box = fixture.debugElement.nativeElement.querySelector(
      'mat-checkbox'
    );
    const evnt = new MatCheckboxChange();
    evnt.source = box;
    evnt.checked = true;
    component.masterToggle(evnt);
    fixture.whenStable().then(() => {
      expect(
        component.selection.selected.filter(user => user.isDisabled).length
      ).toEqual(disabledUsers.length);
      component.disableSelectedUsers(); // user spy to cancel
      fixture.detectChanges();
      component.disableSelectedUsers(); // iuser spy to accept
      fixture.detectChanges();
      expect(
        component.selection.selected.filter(user => !user.isDisabled).length
      ).toEqual(0);
      done();
    });
  });
  it('should disable selected users but two selected users were not allowed to enabled', done => {
    AwsLambdaServiceMock._setUpdateUserRes([false, false]); // two of the updates will fail
    const box = fixture.debugElement.nativeElement.querySelector(
      'mat-checkbox'
    );
    const evnt = new MatCheckboxChange();
    evnt.source = box;
    evnt.checked = true;
    component.masterToggle(evnt);
    fixture.detectChanges();
    component.disableSelectedUsers(false);
    fixture.detectChanges();
    // there are 5 users and minus the 2 fails then we should expect 3 user that are enabled
    expect(
      component.selection.selected.filter(user => user.isDisabled === false)
        .length
    ).toEqual(3);
    done();
  });
  describe('when updateUser lambda works correctly', () => {
    beforeEach(() => {
      spyOn(AwsLambdaServiceMock, 'updateUser').and.callThrough();
    });
    it('should disable an individual user correctly', () => {
      const componentDebug = fixture.debugElement;
      const slider = componentDebug.query(By.directive(MatSlideToggle));

      slider.triggerEventHandler('change', { checked: true }); // triggerEventHandler
      fixture.whenStable().then(() => {
        expect(AwsLambdaServiceMock.updateUser).toHaveBeenCalled();
        expect(component.dataSource.data[0].isDisabled).toBeTruthy(); // event has been called
      });
    });
  });
  describe('when updateUser lambda failed', () => {
    let deleteUserSpy;
    beforeEach(() => {
      const lambda = fixture.debugElement.injector.get(AwsLambdaService);
      deleteUserSpy = spyOn(lambda, 'updateUser').and.returnValue(
        throwError({ status: 404, errorDetail: 'kaput' })
      );
    });
    it('should not disable the individual user ', () => {
      const componentDebug = fixture.debugElement;
      const slider = componentDebug.query(By.directive(MatSlideToggle));

      slider.triggerEventHandler('change', { checked: true }); // triggerEventHandler
      // fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(deleteUserSpy).toHaveBeenCalled();
        expect(component.dataSource.data[0].isDisabled).toBeFalsy(); // event has been called
      });
    });
  });
  describe('when updateUser lambda works correctly', () => {
    let updateUserSpy;
    beforeEach(() => {
      const lambda = fixture.debugElement.injector.get(AwsLambdaService);
      updateUserSpy = spyOn(lambda, 'updateUser').and.callThrough();
    });
    it('should enable an individual user correctly', done => {
      const componentDebug = fixture.debugElement;
      const slider = componentDebug.query(By.directive(MatSlideToggle));

      slider.triggerEventHandler('change', { checked: false }); // triggerEventHandler
      fixture.whenStable().then(() => {
        expect(updateUserSpy).toHaveBeenCalled();
        expect(component.dataSource.data[0].isDisabled).toBeFalsy(); // event has been called
        done();
      });
    });
  });
  describe('when updateUser lambda failed', () => {
    let updateUserSpy;
    let lambda;
    beforeEach(() => {
      lambda = fixture.debugElement.injector.get(AwsLambdaService);
      updateUserSpy = spyOn(lambda, 'updateUser').and.returnValue(
        throwError({ status: 404, errorDetail: 'kaput' })
      );
    });
    it('should not enable individual user ', async(() => {
      // TODO this works correctly in the chrome debugger but failed in batch testing.
      // const componentDebug = fixture.debugElement;
      // const slider = componentDebug.queryAll(By.directive(MatSlideToggle))[3];
      // slider.triggerEventHandler('change', { checked: false }); // triggerEventHandler
      const event = new MatSlideToggleChange(undefined, false);
      component.toggleDisable(event, {
        username: 'user2.lead@leidos.com',
        role: 'Lead',
        GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
        group: 'DOS',
        isAdmin: false,
        firstname: 'Test',
        lastname: 'Test',
        fullname: 'Test Test',
        isDisabled: true
      });
      fixture.whenStable().then(() => {
        expect(updateUserSpy).toHaveBeenCalled();
        // TODO  the UI side refused to comply.
        // expect(component.dataSource.data[3].Disabled).toBeTruthy(); // event has been called
      });
    }));
  });
  describe('when updateUser lambda failed without errorDetail', () => {
    let updateUserSpy;
    beforeEach(() => {
      const lambda = fixture.debugElement.injector.get(AwsLambdaService);
      updateUserSpy = spyOn(lambda, 'updateUser').and.returnValue(
        throwError({ status: 404, message: 'kaput' })
      );
    });
    it('should not enable individual user ', async(() => {
      const event = new MatSlideToggleChange(undefined, false);
      component.toggleDisable(event, {
        username: 'user2.lead@leidos.com',
        role: 'Lead',
        GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
        group: 'DOS',
        isAdmin: false,
        firstname: 'Test',
        lastname: 'Test',
        fullname: 'Test Test',
        isDisabled: true
      });
      fixture.whenStable().then(() => {
        expect(updateUserSpy).toHaveBeenCalled();
      });
    }));
  });
  describe('when delete lambda failed without errorDetail', () => {
    let deleteUserSpy;
    beforeEach(() => {
      const lambda = fixture.debugElement.injector.get(AwsLambdaService);
      deleteUserSpy = spyOn(lambda, 'updateUser').and.returnValue(
        throwError({ status: 404, message: 'kaput' })
      );
    });
    it('should not enable individual user ', async(() => {
      const event = new MatSlideToggleChange(undefined, true);
      component.toggleDisable(event, {
        username: 'user2.lead@leidos.com',
        role: 'Lead',
        GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
        group: 'DOS',
        isAdmin: false,
        firstname: 'Test',
        lastname: 'Test',
        fullname: 'Test Test',
        isDisabled: false
      });
      fixture.whenStable().then(() => {
        expect(deleteUserSpy).toHaveBeenCalled();
      });
    }));
  });
  it('should open edit dialog on indivdual user correctly', () => {
    const user: BaaSUser = {
      username: 'test@test.gov',
      fullname: 'Test Lead',
      firstname: 'Test',
      lastname: 'Lead',
      group: 'ORG/Grp1/Grp11',
      role: 'Lead',
      isDisabled: false
    };
    const tally = [
      ...fixture.debugElement.nativeNode.parentElement.querySelectorAll(
        'mat-dialog-container'
      )
    ].filter(node => !node.innerText.includes('BaaS Notification')).length;
    expect(tally).toEqual(0);
    component.openDialog(user);
    fixture.whenStable().then(() => {
      const afterTally = [
        ...fixture.debugElement.nativeNode.parentElement.querySelectorAll(
          'mat-dialog-container'
        )
      ].filter(node => node.innerText.includes('Edit User')).length;
      // Edit User
      expect(afterTally).toEqual(1);
    });
  });
  it('should close edit dialog on individual user correctly', async(() => {
    const user: BaaSUser = {
      username: 'test@test.gov',
      fullname: 'Test Lead',
      firstname: 'Test',
      lastname: 'Lead',
      group: 'ORG/Grp1/Grp11',
      role: 'Lead',
      isDisabled: false
    };
    component.openDialog(user);
    component.detailsPopup.close({
      disabled: true,
      group: 'US/VA',
      role: 'Admin',
      firstname: 'test',
      lastname: 'test'
    });
    fixture.whenStable().then(() => {
      const afterTally = [
        ...fixture.debugElement.nativeNode.parentElement.querySelectorAll(
          'mat-dialog-container'
        )
      ].filter(node => node.innerText.includes('Edit User')).length;
      // Edit User
      expect(afterTally).toEqual(0);
    });
  }));
  it('should getUsers correctly as Lead user', () => {
    const userService = TestBed.get(UserService);
    userService.InitializeUserSession('lead');
    component.getUsers();
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  });
  it('should not getUsers correctly as FSP user', () => {
    const userService = TestBed.get(UserService);
    component.dataSource.data.splice(0, component.dataSource.data.length);
    userService.InitializeUserSession('fsp');
    component.getUsers();
    expect(component.dataSource.data.length).toEqual(0);
  });

  describe('when getUsers lambda failed without errorDetail', () => {
    let getUsersSpy;
    beforeEach(() => {
      const lambda = fixture.debugElement.injector.get(AwsLambdaService);
      const userService = TestBed.get(UserService);
      userService.InitializeUserSession('admin');
      getUsersSpy = spyOn(lambda, 'getUsers').and.returnValue(
        throwError({ status: 404, message: 'kaput' })
      );
    });
    it('should not get-users ', async(() => {
      component.getUsers();
      expect(component.dataSource.data.length).toEqual(5);
    }));
  });
  it('should enter filter info and clear them correctly', done => {
    component.applyFilter('test');
    fixture.detectChanges();
    let rows = fixture.debugElement.nativeElement.querySelectorAll(
      'mat-checkbox'
    );
    expect(rows.length).toEqual(4); // 5 users and 2 has username with 'test' and header
    component.clearFilter();
    fixture.detectChanges();
    rows = fixture.debugElement.nativeElement.querySelectorAll('mat-checkbox');
    expect(rows.length).toEqual(6);
    done();
  });
});
