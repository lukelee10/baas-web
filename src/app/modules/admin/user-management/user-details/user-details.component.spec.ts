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
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { AwsLambdaServiceMock } from 'src/app/core/services/aws-lambda.service.spec';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { GroupManagementComponent } from '../../group-management/group-management.component';
import { UserDetailsComponent } from './user-details.component';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  const dialogMock = {
    close: () => {},
    backdropClick: (): Observable<any> => of({})
  };
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
        { provide: MAT_DIALOG_DATA, useValue: {} }
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
    it('should submit correctly', () => {
      const mockNotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      const spymockNotificationService = spyOn(
        mockNotificationService,
        'error'
      );
      const spymockNotificationServiceSuccess = spyOn(
        mockNotificationService,
        'successful'
      );
      const firstname = fixture.debugElement.nativeElement.querySelectorAll(
        'input'
      )[1];
      firstname.value = 'firstname';
      component.form.get('disabled').setValue(true);
      expect(component.form.controls.firstname.valid).toBeFalsy();
      component.form.controls.firstname.markAsDirty();
      component.form.controls.group.markAsDirty();
      component.form.controls.role.markAsDirty();
      component.form.controls.disabled.markAsDirty();
      component.submit();
      fixture.detectChanges();
      expect(spymockNotificationService).not.toHaveBeenCalled();
      expect(spymockNotificationServiceSuccess).toHaveBeenCalled();
    });
  });

  describe('when submit but updateUser lambda failed', () => {
    beforeEach(() => {
      const lambda = fixture.debugElement.injector.get(AwsLambdaService);
      spyOn(lambda, 'updateUser').and.returnValue(
        throwError({ status: 404, errorDetail: 'kaput' })
      );
    });
    it('should error correctly', () => {
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
      component.form.get('firstname').setValue('firstName');
      component.submit();
      fixture.detectChanges();
      expect(spymockNotificationServiceError).toHaveBeenCalled();
      expect(spymockNotificationServiceSuccess).not.toHaveBeenCalled();
    });
  });

  describe('when submit but updateUser lambda failed without message', () => {
    beforeEach(() => {
      const lambda = fixture.debugElement.injector.get(AwsLambdaService);
      spyOn(lambda, 'updateUser').and.returnValue(throwError({ status: 404 }));
    });
    it('should error correctly', () => {
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
      component.form.get('firstname').setValue('firstName');
      component.submit();
      fixture.detectChanges();
      expect(spymockNotificationServiceError).toHaveBeenCalled();
      expect(spymockNotificationServiceSuccess).not.toHaveBeenCalled();
    });
  });

  describe('when cancel with fields filled in', () => {
    it('should submit correctly', () => {
      const mockNotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      const spymockNotificationService = spyOn(
        mockNotificationService,
        'error'
      );
      const spymockNotificationServiceSuccess = spyOn(
        mockNotificationService,
        'successful'
      );
      component.form.get('firstname').setValue('firstName');
      component.form.get('disabled').setValue(true);
      component.cancel();
      fixture.detectChanges();
      expect(spymockNotificationService).not.toHaveBeenCalled();
      expect(spymockNotificationServiceSuccess).not.toHaveBeenCalled();
    });
  });
});
