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
import { AuthenticationService } from '../../../core/services/authentication.service';

const MIN_PASSWORD_LENGTH = 12;
const CURRENT_PASSWORD = '*=L}lY34;B]@FgR';
const STRONG_PASSWORD = '[~.1@xPLiiLw^$';
const PASSWORD_WITHOUT_ALPHA_LOWER = '[~.1@XPL11LW^$';
const PASSWORD_WITHOUT_ALPHA_UPPER = '[~.1@xpl22lw^$';
const PASSWORD_WITHOUT_SPECIAL_CHAR = '21X1pl33lWJm7r';
const PASSWORD_WITHOUT_NUMERIC = 'jX_cTwl;jXj|Zk';

const mockAuthServiceInfo = {
  LoggedUser: 'username@example.gov',
  JwtToken: 'fakeToken'
};

describe('ChangePasswordComponent When Server Call is Successful', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let clearEl: DebugElement;
  let submitEl: DebugElement;

  const AwsLambdaServiceMock: any = {
    changePassword(value: any): Observable<any> {
      return value.CurrentPassword.includes(CURRENT_PASSWORD)
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
        { provide: AuthenticationService, useValue: mockAuthServiceInfo },
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

  it('should create Change Password component', () => {
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
      CURRENT_PASSWORD
    );
    expect(
      component.changePasswordFormGroup.controls.currentPwd.valid
    ).toBeTruthy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Is Empty', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue('');
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Missing Numeric Digits', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(
      PASSWORD_WITHOUT_NUMERIC
    );
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Missing Alphabetic Lower', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(
      PASSWORD_WITHOUT_ALPHA_LOWER
    );
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Missing Alphabetic Upper', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(
      PASSWORD_WITHOUT_ALPHA_UPPER
    );
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Missing Special Characters', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(
      PASSWORD_WITHOUT_SPECIAL_CHAR
    );
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Too Short', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(
      STRONG_PASSWORD.slice(0, MIN_PASSWORD_LENGTH - 1)
    );
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Is Identical to Current Password', () => {
    component.changePasswordFormGroup.controls.currentPwd.setValue(
      STRONG_PASSWORD
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(STRONG_PASSWORD);
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Is Strong', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(STRONG_PASSWORD);
    expect(
      component.changePasswordFormGroup.controls.newPwd.valid
    ).toBeTruthy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - Confirm Password Is Empty', () => {
    component.changePasswordFormGroup.controls.confirmPwd.setValue('');
    expect(
      component.changePasswordFormGroup.controls.confirmPwd.valid
    ).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - Confirm Password Is Different than New Password', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(STRONG_PASSWORD);
    component.changePasswordFormGroup.controls.confirmPwd.setValue(
      CURRENT_PASSWORD
    );
    expect(
      component.changePasswordFormGroup.controls.confirmPwd.valid
    ).toBeTruthy();
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
      CURRENT_PASSWORD
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(STRONG_PASSWORD);
    component.changePasswordFormGroup.controls.confirmPwd.setValue(
      STRONG_PASSWORD
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
      CURRENT_PASSWORD
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(STRONG_PASSWORD);
    component.changePasswordFormGroup.controls.confirmPwd.setValue(
      STRONG_PASSWORD
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

  const AwsLambdaServiceMock: any = {
    changePassword(value: any): Observable<any> {
      return value.CurrentPassword.includes(CURRENT_PASSWORD)
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
        { provide: AuthenticationService, useValue: mockAuthServiceInfo },
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
      CURRENT_PASSWORD
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(STRONG_PASSWORD);
    component.changePasswordFormGroup.controls.confirmPwd.setValue(
      STRONG_PASSWORD
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
