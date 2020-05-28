import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import { UserRoles } from 'src/app/core/app-global-constants';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { AwsLambdaServiceMock } from 'src/app/core/services/aws-lambda.service.spec';
import { UserService } from 'src/app/core/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { GroupManagementComponent } from '../../group-management/group-management.component';
import { UserDetailsComponent } from './user-details.component';

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
}
describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  const dialogMock = {
    close: () => {},
    backdropClick: (): Observable<any> => of({})
  };
  beforeAll(() => {
    spyOn(window, 'confirm').and.returnValues(true, true, true, true, false);
  });
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
      declarations: [UserDetailsComponent, GroupManagementComponent],
      providers: [
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: UserService, useValue: MockUserServiceAdmin },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            UserId: 'test1@test.gov',
            Role: 'Admin',
            Group: 'GROUP',
            Firstname: 'Test',
            Lastname: 'Admin'
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setGroup', () => {
    const gNode = { item: 'ABC', level: 0, expandable: true, fqn: 'ABC' };
    component.setGroup(gNode);
    expect(component.form.get('group').value).toEqual('ABC');
  });

  describe('when submit with fields filled in', () => {
    let errorNotice;
    let successNotice;
    beforeEach(() => {
      const mockNS = fixture.debugElement.injector.get(NotificationService);
      errorNotice = spyOn(mockNS, 'error');
      successNotice = spyOn(mockNS, 'successful');
    });
    it('should submit changes(without enable/disable) correctly', async(() => {
      component.form.get('firstname').setValue('testFirstname');
      component.form.get('lastname').setValue('testLastname');
      component.form.get('role').setValue('Admin');
      component.form.controls.firstname.markAsDirty();
      component.form.controls.lastname.markAsDirty();
      component.form.controls.role.markAsDirty();
      component.submit();
      fixture.whenStable().then(() => {
        expect(errorNotice).not.toHaveBeenCalled();
        expect(successNotice).toHaveBeenCalled();
      });
    }));
    it('should submit only disable correctly', async(() => {
      component.form.get('disabled').setValue(true);
      component.form.controls.disabled.markAsDirty();
      component.submit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(errorNotice).not.toHaveBeenCalled();
        expect(successNotice).toHaveBeenCalled();
      });
    }));
    it('should submit group change and enable correctly', async(() => {
      component.form.get('disabled').setValue(false);
      component.form.controls.disabled.markAsDirty();
      component.form.get('group').setValue('US/VA');
      component.form.controls.group.markAsDirty();
      component.submit();
      fixture.whenStable().then(() => {
        expect(errorNotice).not.toHaveBeenCalled();
        expect(successNotice).toHaveBeenCalled();
      });
    }));
  });

  describe('when submit but updateUser lambda failed', () => {
    beforeEach(() => {
      const lambda = fixture.debugElement.injector.get(AwsLambdaService);
      spyOn(lambda, 'updateUser').and.returnValue(
        throwError({ status: 404, errorDetail: 'kaput' })
      );
    });
    it('should error correctly', async(() => {
      const mockNotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      const spymockNotificationServiceError = spyOn(
        mockNotificationService,
        'error'
      );
      const spymockNotificationServiceSuccess = spyOn(
        mockNotificationService,
        'successful'
      );
      component.form.get('group').setValue('US/VA');
      component.form.controls.group.markAsDirty();
      component.submit();
      fixture.whenStable().then(() => {
        expect(spymockNotificationServiceError).toHaveBeenCalled();
      });
    }));
  });

  describe('when submit but updateUserName lambda failed', () => {
    let errorNotice;
    let successNotice;
    beforeEach(() => {
      const mockNS = fixture.debugElement.injector.get(NotificationService);
      errorNotice = spyOn(mockNS, 'error');
      successNotice = spyOn(mockNS, 'successful');
      const lambda = fixture.debugElement.injector.get(AwsLambdaService);
      spyOn(lambda, 'updateUserName').and.returnValue(
        throwError({ status: 404, errorDetail: 'kaput' })
      );
    });
    it('should error correctly', async(() => {
      component.form.get('group').setValue('US/VA');
      component.form.get('firstname').setValue('firstName');
      component.form.get('lastname').setValue('lastName');
      component.form.controls.group.markAsDirty();
      component.form.controls.firstname.markAsDirty();
      component.form.controls.lastname.markAsDirty();
      component.submit();
      fixture.whenStable().then(() => {
        expect(errorNotice).toHaveBeenCalled();
        expect(successNotice).not.toHaveBeenCalled();
      });
    }));
  });

  describe('when submit but updateUserName lambda failed without errorDetail', () => {
    let errorNotice;
    let successNotice;
    beforeEach(() => {
      const mockNS = fixture.debugElement.injector.get(NotificationService);
      errorNotice = spyOn(mockNS, 'error');
      successNotice = spyOn(mockNS, 'successful');
      const lambda = fixture.debugElement.injector.get(AwsLambdaService);
      spyOn(lambda, 'updateUserName').and.returnValue(
        throwError({ status: 404, message: 'kaput' })
      );
    });
    it('should error correctly', async(() => {
      component.form.get('group').setValue('US/VA');
      component.form.get('firstname').setValue('firstName');
      component.form.get('lastname').setValue('lastName');
      component.form.controls.group.markAsDirty();
      component.form.controls.firstname.markAsDirty();
      component.form.controls.lastname.markAsDirty();
      component.submit();
      fixture.whenStable().then(() => {
        expect(errorNotice).toHaveBeenCalled();
        expect(successNotice).not.toHaveBeenCalled();
      });
    }));
  });

  describe('when cancel with fields filled in', () => {
    let spymockNotificationService;
    let spymockNotificationServiceSuccess;
    beforeEach(() => {
      const mockNotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spymockNotificationService = spyOn(mockNotificationService, 'error');
      spymockNotificationServiceSuccess = spyOn(
        mockNotificationService,
        'successful'
      );
    });
    it('should cancel and close when user confirm discard changes', () => {
      component.form.get('firstname').setValue('firstName');
      component.form.get('disabled').setValue(true);
      component.form.controls.disabled.markAsDirty();
      component.form.controls.firstname.markAsDirty();
      component.cancel();
      fixture.detectChanges();
      expect(spymockNotificationService).not.toHaveBeenCalled();
      expect(spymockNotificationServiceSuccess).not.toHaveBeenCalled();
    });

    it('should cancel and not close when user not-confirm discard changes', () => {
      component.form.get('firstname').setValue('firstName');
      component.form.get('disabled').setValue(true);
      component.form.controls.disabled.markAsDirty();
      component.form.controls.firstname.markAsDirty();
      component.cancel();
      fixture.detectChanges();
      expect(spymockNotificationService).not.toHaveBeenCalled();
      expect(spymockNotificationServiceSuccess).not.toHaveBeenCalled();
    });
    it('should cancel and close without any changes', () => {
      component.cancel();
      fixture.detectChanges();
      expect(spymockNotificationService).not.toHaveBeenCalled();
      expect(spymockNotificationServiceSuccess).not.toHaveBeenCalled();
    });
  });
});
