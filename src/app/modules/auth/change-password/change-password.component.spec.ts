import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';

import { ChangePasswordComponent } from './change-password.component';
import { AwsLambdaService } from '../../../core/services/aws-lambda.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { NotificationService } from '../../../shared/services/notification.service';

describe('ChangePasswordComponent When Server Call is Successful', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let clearEl: DebugElement;
  let submitEl: DebugElement;

  const currentPassword = 'etytyte2222';

  const AwsLambdaServiceMock: any = {
    changePassword(value: any): Observable<any> {
      return value.CurrentPassword.includes(currentPassword)
        ? of({ data: true })
        : throwError({ status: 404 });
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock },
        NotificationService,
        LoaderService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    clearEl = fixture.debugElement.query(By.css('button[type=reset]'));
    submitEl = fixture.debugElement.query(By.css('button[type=submit]'));
  });

  it('should create Change Password', () => {
    expect(component).toBeTruthy();
  });

  it('ChangePasswordComponent - Current Password Validation Negative Test ', () => {
    component.changePasswordFormGroup.controls.currentPwd.setValue('');
    expect(
      component.changePasswordFormGroup.controls.currentPwd.valid
    ).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - Current Password Validation Positive Test ', () => {
    component.changePasswordFormGroup.controls.currentPwd.setValue(
      'etytyte2222'
    );
    expect(
      component.changePasswordFormGroup.controls.currentPwd.valid
    ).toBeTruthy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Validation Negative Test ', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue('');
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Validation Positive Test ', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(
      'etytekjgkte2222'
    );
    expect(
      component.changePasswordFormGroup.controls.newPwd.valid
    ).toBeTruthy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - Confirm Password Validation Negative Test ', () => {
    component.changePasswordFormGroup.controls.confirmPwd.setValue('');
    expect(
      component.changePasswordFormGroup.controls.confirmPwd.valid
    ).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - Confirm Password Validation Positive Test ', () => {
    component.changePasswordFormGroup.controls.confirmPwd.setValue(
      'hjfjhfjfhf'
    );
    expect(
      component.changePasswordFormGroup.controls.confirmPwd.valid
    ).toBeTruthy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - Submit Button Enabled Test ', () => {
    component.changePasswordFormGroup.controls.currentPwd.setValue(
      'etytyte2222'
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(
      'etytekjgkte2222'
    );
    component.changePasswordFormGroup.controls.confirmPwd.setValue(
      'hjfjhfjfhf'
    );
    expect(
      component.changePasswordFormGroup.controls.currentPwd.valid
    ).toBeTruthy();
    expect(
      component.changePasswordFormGroup.controls.newPwd.valid
    ).toBeTruthy();
    expect(
      component.changePasswordFormGroup.controls.confirmPwd.valid
    ).toBeTruthy();
    expect(component.changePasswordFormGroup.valid).toBeTruthy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeFalsy();
  });

  it('Pressing Submit with mock server call successful', async(() => {
    const loaderServiceShow = spyOn(LoaderService.prototype, 'Show');
    const loaderServiceHide = spyOn(LoaderService.prototype, 'Hide');
    const notificationServiceSuccessful = spyOn(
      NotificationService.prototype,
      'successful'
    );
    const notificationServiceError = spyOn(
      NotificationService.prototype,
      'error'
    );

    component.changePasswordFormGroup.controls.currentPwd.setValue(
      'etytyte2222'
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(
      'etytekjgkte2222'
    );
    component.changePasswordFormGroup.controls.confirmPwd.setValue(
      'hjfjhfjfhf'
    );
    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeFalsy();

    submitEl.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(loaderServiceShow).toHaveBeenCalled();
      expect(loaderServiceShow).toHaveBeenCalledTimes(1);
      expect(loaderServiceHide).toHaveBeenCalled();
      expect(loaderServiceHide).toHaveBeenCalledTimes(1);

      expect(notificationServiceSuccessful).toHaveBeenCalled();
      expect(notificationServiceSuccessful).toHaveBeenCalledTimes(1);
      expect(notificationServiceError).toHaveBeenCalledTimes(0);
    });
  }));
});

describe('ChangePasswordComponent When Server Call is Failed', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let clearEl: DebugElement;
  let submitEl: DebugElement;

  const currentPassword = 'etytyte2222';

  const AwsLambdaServiceMock: any = {
    changePassword(value: any): Observable<any> {
      return value.CurrentPassword.includes(currentPassword)
        ? throwError({ status: 404 })
        : of({ data: true });
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock },
        NotificationService,
        LoaderService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    clearEl = fixture.debugElement.query(By.css('button[type=reset]'));
    submitEl = fixture.debugElement.query(By.css('button[type=submit]'));
  });

  it('should create Change Password', () => {
    expect(component).toBeTruthy();
  });

  it('Pressing Submit with failed mock service call', async(() => {
    const loaderServiceShow = spyOn(LoaderService.prototype, 'Show');
    const loaderServiceHide = spyOn(LoaderService.prototype, 'Hide');
    const notificationServiceSuccessful = spyOn(
      NotificationService.prototype,
      'successful'
    );
    const notificationServiceError = spyOn(
      NotificationService.prototype,
      'error'
    );

    component.changePasswordFormGroup.controls.currentPwd.setValue(
      'etytyte2222'
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(
      'etytekjgkte2222'
    );
    component.changePasswordFormGroup.controls.confirmPwd.setValue(
      'hjfjhfjfhf'
    );
    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeFalsy();

    submitEl.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(loaderServiceShow).toHaveBeenCalled();
      expect(loaderServiceShow).toHaveBeenCalledTimes(1);
      expect(loaderServiceHide).toHaveBeenCalled();
      expect(loaderServiceHide).toHaveBeenCalledTimes(1);

      expect(notificationServiceSuccessful).toHaveBeenCalledTimes(0);
      expect(notificationServiceError).toHaveBeenCalled();
      expect(notificationServiceError).toHaveBeenCalledTimes(1);
    });
  }));
});
