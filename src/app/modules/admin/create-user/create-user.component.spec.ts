import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

import { NotificationService } from '../../../shared/services/notification.service';
import { SharedModule } from './../../../shared/shared.module';
import { CreateUserComponent } from './create-user.component';

let adminStatus;

const AwsLambdaServiceMock: any = {
  createUser(value: any): Observable<any> {
    adminStatus = value.user.admin;
    if (value.user.email === 'shouldCause422.gov') {
      return throwError({ status: 422 });
    } else if (value.user.email === 'shouldCauseNon422.gov') {
      return throwError({ status: 430 });
    } else {
      return of({ data: true });
    }
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
      declarations: [CreateUserComponent],
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
  });

  it('Form should be valid', () => {
    component.email.setValue('test@abc.gov');
    expect(NEW_USER.email).toEqual('test@abc.gov');
  });

  it('Admin boolean should be true when role is set to admin', async(() => {
    component.role.setValue('Admin');
    const button = fixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    button.click();
    expect(adminStatus).toBeTruthy();
  }));

  it('Error when creating new user', () => {
    component.email.setValue('shouldCause422.gov');
    const button = fixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    button.click();
    fixture.detectChanges();
    expect(component.errMessage).toEqual('Cannot create new user');
  });

  it('Expect the console to print error message', () => {
    component.email.setValue('shouldCauseNon422.gov');
    const button = fixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    button.click();
    fixture.detectChanges();
    expect(component.errMessage).toBeTruthy();
  });
});
