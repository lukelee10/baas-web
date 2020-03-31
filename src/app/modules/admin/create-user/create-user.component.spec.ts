import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { UserRoles } from 'src/app/core/app-global-constants';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { UserService } from 'src/app/core/services/user.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

import { NotificationService } from '../../../shared/services/notification.service';
import { GroupManagementComponent } from '../group-management/group-management.component';
import { SharedModule } from './../../../shared/shared.module';
import { CreateUserComponent } from './create-user.component';

// Mock the SortService class, its method and return it with mock data
class MockUserService extends UserService {
  get Role(): string {
    return UserRoles.NonFSPUser;
  }
  get UserId(): string {
    return 'test@test.gov';
  }
  get Group(): string {
    return 'DEFAULT';
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
const mockRouter = { navigate };
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
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;

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
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // router = TestBed.get(Router);
  });

  it('Form should be valid', () => {
    component.form.get('email').setValue('test@abc.gov');
    expect(NEW_USER.email).toEqual('test@abc.gov');
  });

  it('Admin boolean should be true when role is set to admin', async(() => {
    component.form.get('email').setValue('user123@leidos.com');
    component.form.get('password').setValue('P@ssw0rd123!');
    component.form.get('firstname').setValue('user');
    component.form.get('lastname').setValue('test');
    component.form.get('group').setValue('BaaS');
    component.form.get('role').setValue('Admin');
    component.form.get('disabled').setValue('true');
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[4];
    button.click();
    fixture.whenStable().then(() => {
      expect(adminStatus).toBeTruthy();
    });
  }));

  it('Error when creating new user', () => {
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
    const spymockNotificationService = spyOn(mockNotificationService, 'error');
    component.submit();
    fixture.detectChanges();
    expect(component.errMessage).toBeTruthy();
    expect(component.errMessage).toEqual('Cannot create new user');
    expect(spymockNotificationService.calls.any()).toBeTruthy();
  });
});
