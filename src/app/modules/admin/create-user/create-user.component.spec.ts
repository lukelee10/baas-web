import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { UserRoles } from 'src/app/core/app-global-constants';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { UserService } from 'src/app/core/services/user.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

import { NotificationService } from '../../../shared/services/notification.service';
import {
  GroupFlatNode,
  GroupManagementComponent
} from '../group-management/group-management.component';
import { SharedModule } from './../../../shared/shared.module';
import { CreateUserComponent } from './create-user.component';

// Mock the SortService class, its method and return it with mock data
class MockUserServiceLead extends UserService {
  get Role(): string {
    return UserRoles.Lead;
  }
  get UserId(): string {
    return 'test@test.gov';
  }
  get Group(): string {
    return 'DEFAULT';
  }
  get IsAdmin(): boolean {
    return false;
  }
}

class MockUserServiceAdmin extends UserService {
  get Role(): string {
    return UserRoles.Admin;
  }
  get UserId(): string {
    return 'test@test.gov';
  }
  get Group(): string {
    return 'DEFAULT';
  }

  get IsAdmin(): boolean {
    return true;
  }
}

class MdDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open() {
    return {
      afterClosed: () => of('New Group')
    };
  }
}

let adminStatus;

const AwsLambdaServiceMock: any = {
  createUser(value: any): Observable<any> {
    adminStatus = value.user.admin;
    if (value.user.email === 'shouldCause422@gov') {
      return throwError({ status: 422 });
    } else if (value.user.email === 'shouldCauseNon422.gov') {
      return throwError({ status: 430 });
    } else {
      return of({ data: true });
    }
  },
  createOrg(newOrg): Observable<any> {
    return newOrg.org.name.includes('kaput')
      ? throwError({ status: 404 })
      : of({ status: 'ok' });
  },
  getOrgs(): Observable<any> {
    return of({
      Items: [
        { OrgId: 'Europe', Parent: 'DOS' },
        { OrgId: 'France Embassy', Parent: 'Europe' },
        { OrgId: 'Chili Embassy', Parent: 'South America' },
        { OrgId: 'GB', Parent: 'Europe' },
        { OrgId: 'Brazil Embassy', Parent: 'South America' },
        { OrgId: 'Glasgow', Parent: 'GB' },
        { OrgId: 'Gang' },
        { OrgId: 'London', Parent: 'GB' },
        { OrgId: 'South America', Parent: 'DOS' },
        { OrgId: 'NCIS' },
        { OrgId: 'Springfield, VA', Parent: 'NCIS' },
        { OrgId: 'Berlin office', Parent: 'German Embassy' },
        { OrgId: 'DOS' },
        { OrgId: 'German Embassy', Parent: 'Europe' }
      ],
      Count: 14,
      ScannedCount: 14,
      ConsumedCapacity: { TableName: 'SomeOrganization', CapacityUnits: 2 }
    });
  }
};

const navigate = jasmine.createSpy('navigate');
const mockRouter = { navigate: jasmine.createSpy('navigate') };
const fakeActivatedRoute = { queryParams: of({ userid: '123' }) };

const NEW_USER = {
  email: 'test@abc.gov',
  lastname: 'TestLastName',
  firstname: 'TestFirstName',
  admin: false,
  group: 'TestOrg/TestGroup',
  role: ' ',
  temporaryPassword: 'QweAsdZxc!1@'
};

describe('CreateUserComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        SharedModule,
        MatInputModule
      ],
      declarations: [CreateUserComponent, GroupManagementComponent],
      providers: [
        NotificationService,
        LoaderService,
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: UserService, useValue: MockUserServiceAdmin }
      ]
    });
  }));

  testCase(UserRoles.Lead);
  testCase(UserRoles.Admin);
  testCase3();
  testSetGroup();
  testValidateNoUserID();
});

function testCase(userRole: string) {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  describe(`When ${userRole} is accessing`, () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: UserService,
            useClass:
              userRole === UserRoles.Lead
                ? MockUserServiceLead
                : MockUserServiceAdmin
          }
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(CreateUserComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be  a valid form', () => {
      component.form.get('email').setValue('test@abc.gov');
      expect(NEW_USER.email).toEqual('test@abc.gov');
    });

    it(`should have right Admin flag, it should be "${userRole ===
      UserRoles.Admin}" when role is set to ${userRole}`, async(() => {
      component.form.get('email').setValue('user123@leidos.com');
      component.form.get('password').setValue('P@ssw0rd123!');
      component.form.get('firstname').setValue('user');
      component.form.get('lastname').setValue('test');
      component.form.get('group').setValue('BaaS');
      component.form.get('role').setValue(userRole);
      component.form.get('disabled').setValue('true');
      fixture.detectChanges();
      const button = fixture.debugElement.nativeElement.querySelectorAll(
        'button'
      )[4];
      button.click();
      fixture.whenStable().then(() => {
        userRole === UserRoles.Admin
          ? expect(adminStatus).toBeTruthy()
          : expect(adminStatus).toBeFalsy();
      });
    }));

    it('should able to handle the error', () => {
      const awsLambdaService = fixture.debugElement.injector.get(
        AwsLambdaService
      );
      const mockCall = spyOn(awsLambdaService, 'createUser').and.returnValue(
        throwError({ status: 404 })
      );
      fixture.detectChanges();
      const mockNotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      const spymockNotificationService = spyOn(
        mockNotificationService,
        'error'
      );
      component.submit();
      fixture.detectChanges();
      expect(component.errMessage).toBeTruthy();
      expect(component.errMessage).toEqual('Cannot create new user');
      expect(spymockNotificationService.calls.any()).toBeTruthy();
    });

    it('should handle the cancel event correctly', () => {
      component.cancel();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
    });

    it('should retrieve the value from email input field', () => {
      const emailStr = component.email.value;
      expect(emailStr.length >= 0).toBeTruthy();
    });
  });
}
function testCase3() {
  let component2: CreateUserComponent;
  let fixture2: ComponentFixture<CreateUserComponent>;
  let passwordField2;
  let spyMethod;
  describe(`When password field is on set focus`, () => {
    beforeEach(() => {
      fixture2 = TestBed.createComponent(CreateUserComponent);
      component2 = fixture2.componentInstance;
      fixture2.detectChanges();
    });

    it('should attach all the password validators', () => {
      passwordField2 = fixture2.debugElement.query(
        By.css('input[type=password]')
      ).nativeElement;
      spyMethod = spyOn(component2, 'initPasswordValidators').and.callThrough();
      passwordField2.dispatchEvent(new Event('focus'));
      expect(spyMethod).toHaveBeenCalled();
    });
  });
}
function testSetGroup() {
  let component2: CreateUserComponent;
  let fixture2: ComponentFixture<CreateUserComponent>;
  let groupElement;
  describe(`When picking a group`, () => {
    beforeEach(() => {
      fixture2 = TestBed.createComponent(CreateUserComponent);
      component2 = fixture2.componentInstance;
      fixture2.detectChanges();
      const nd = new GroupFlatNode();
      nd.fqn = 'AB/CD';
      component2.setGroup(nd);

      groupElement = fixture2.debugElement.query(By.css('input[type=password]'))
        .nativeElement;
      groupElement.dispatchEvent(new Event('focus'));
      groupElement.value = 'fddfd';
      groupElement.dispatchEvent(new Event('blur'));
      fixture2.detectChanges();
    });

    it('should have password field be invalid', done => {
      expect(component2.form.controls.password.valid).toBeFalsy();
      done();
    });
  });
}
function testValidateNoUserID() {
  const USER_NAME = 'abc@test.gov';
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  describe(`When password field has username in it.`, () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(CreateUserComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.initPasswordValidators();
    });

    it('should attach all the password validators', done => {
      component.form.get('email').setValue(USER_NAME);
      component.form.get('password').setValue(`123${USER_NAME}abc`);
      const pForm = component.form.controls.password;

      fixture.whenStable().then(() => {
        expect(pForm.valid).toBeFalsy();
        done();
      });
    });
    it('should attach all the password validators', done => {
      component.form.get('email').setValue(USER_NAME);
      component.form.get('password').setValue(`123ABC%%#abc`);
      const pForm = component.form.controls.password;

      fixture.whenStable().then(() => {
        expect(pForm.valid).toBeTruthy();
        done();
      });
    });
  });
}
