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
import { UserService } from 'src/app/core/services/user.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

const MIN_PASSWORD_LENGTH = 12;
const MAX_DUPLICATE_COUNT = 3;
const CURRENT_PASSWORD = '*=L}lY34;B]@FgR';
const STRONG_PASSWORD = '[~.1@xPLiiLw^$';
const PASSWORD_WITHOUT_ALPHA_LOWER = '[~.1@XPL11LW^$';
const PASSWORD_WITHOUT_ALPHA_UPPER = '[~.1@xpl22lw^$';
const PASSWORD_WITHOUT_SPECIAL_CHAR = '21X1pl33lWJm7r';
const PASSWORD_WITHOUT_NUMERIC = 'jX_cTwl;jXj|Zk';
const PASSWORD_WITH_TOO_MANY_CONSECUTIVE_DUPLICATES =
  STRONG_PASSWORD + 'R'.repeat(1 + MAX_DUPLICATE_COUNT);
const PASSWORD_WITH_PERMISSIBLE_CONSECUTIVE_DUPLICATES =
  STRONG_PASSWORD.replace(/R+$/g, '') + 'R'.repeat(MAX_DUPLICATE_COUNT);

const MOCKED_USERNAME = 'username@example.gov';
const mockAuthServiceInfo = {
  LoggedUser: MOCKED_USERNAME,
  JwtToken: 'fakeToken'
};
const mockUserService = {
  LastLoginTime: '2020-08-07T15:13:53.420Z',
  UserId: MOCKED_USERNAME,
  Role: 'Admin',
  GUID: '2323-232-32-23-232-323232',
  Disabled: false,
  LastPasswordUpdate: '2020-07-30T14:48:20.846Z',
  Group: 'DEFAULT',
  IsAdmin: true,
  Firstname: 'Test',
  LastActivityTime: '2020-08-07T15:13:55.642Z',
  Lastname: 'User'
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
        : throwError({ status: 422 });
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
        { provide: UserService, useValue: mockUserService },
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

  it('ChangePasswordComponent - Current Password Validation Negative Test', () => {
    component.changePasswordFormGroup.controls.currentPwd.setValue('');
    expect(
      component.changePasswordFormGroup.controls.currentPwd.valid
    ).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - Current Password Validation Positive Test', () => {
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

  it('ChangePasswordComponent - New Password Has Excessive Consecutive Duplicated Chars', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(
      PASSWORD_WITH_TOO_MANY_CONSECUTIVE_DUPLICATES
    );
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Has Permissible Consecutive Duplicated Chars', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(
      PASSWORD_WITH_PERMISSIBLE_CONSECUTIVE_DUPLICATES
    );
    expect(
      component.changePasswordFormGroup.controls.newPwd.valid
    ).toBeTruthy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Contains Username', () => {
    // Build the password by toggling each character of the username and
    //   then embedding that result within a strong password.
    const aToggleCasedUsername = [...MOCKED_USERNAME].map((c, i) =>
      // Invoke 'toLowerCase' when i is even; else, 'toUpperCase'
      c[['toLowerCase', 'toUpperCase'][i % 2]]()
    );
    const sPasswordWithUsername = '~1_' + aToggleCasedUsername.join('') + '_3~';

    component.changePasswordFormGroup.controls.currentPwd.setValue(
      CURRENT_PASSWORD
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(
      sPasswordWithUsername
    );
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Contains First Name', () => {
    // Build the password by toggling each character of the first name and
    //   then embedding that result within a strong password.
    const aToggleCasedFirstname = [...mockUserService.Firstname].map((c, i) =>
      // Invoke 'toLowerCase' when i is even; else, 'toUpperCase'
      c[['toLowerCase', 'toUpperCase'][i % 2]]()
    );
    const sPasswordWithFirstname =
      '~1_' + aToggleCasedFirstname.join('') + '_3~';

    component.changePasswordFormGroup.controls.currentPwd.setValue(
      CURRENT_PASSWORD
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(
      sPasswordWithFirstname
    );
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - New Password Contains Last Name', () => {
    // Build the password by toggling each character of the last name and
    //   then embedding that result within a strong password.
    const aToggleCasedLastname = [...mockUserService.Lastname].map((c, i) =>
      // Invoke 'toLowerCase' when i is even; else, 'toUpperCase'
      c[['toLowerCase', 'toUpperCase'][i % 2]]()
    );
    const sPasswordWithLastname = '~1_' + aToggleCasedLastname.join('') + '_3~';

    component.changePasswordFormGroup.controls.currentPwd.setValue(
      CURRENT_PASSWORD
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(
      sPasswordWithLastname
    );
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
    ).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - Confirm Password Validation Positive Test', () => {
    component.changePasswordFormGroup.controls.newPwd.setValue(STRONG_PASSWORD);
    component.changePasswordFormGroup.controls.confirmPwd.setValue(
      STRONG_PASSWORD
    );
    expect(
      component.changePasswordFormGroup.controls.confirmPwd.valid
    ).toBeTruthy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('ChangePasswordComponent - Submit Button Enabled Test', () => {
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

  it('ChangePasswordComponent - Should Use NotificationService to Show a "Success" Message', async(() => {
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
      expect(notificationServiceError).not.toHaveBeenCalled();
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
        ? throwError({ status: 422 })
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
        { provide: UserService, useValue: mockUserService },
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

      expect(notificationServiceSuccessful).not.toHaveBeenCalled();
      expect(notificationServiceError).toHaveBeenCalled();
      expect(notificationServiceError).toHaveBeenCalledTimes(1);
    });
  }));
});

describe('ChangePasswordComponent When the user on record has a one character firstname', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let clearEl: DebugElement;
  let submitEl: DebugElement;

  const AwsLambdaServiceMock: any = {
    changePassword(value: any): Observable<any> {
      return value.CurrentPassword.includes(CURRENT_PASSWORD)
        ? of({ data: true })
        : throwError({ status: 422 });
    }
  };
  const mockUserServiceOneCharFirstName = {
    UserId: MOCKED_USERNAME,
    Firstname: 'T',
    Lastname: 'User'
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
        { provide: UserService, useValue: mockUserServiceOneCharFirstName },
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

  it('should show error on no-full-name', () => {
    const sPasswordWithFullName = 'T User%^';

    component.changePasswordFormGroup.controls.currentPwd.setValue(
      CURRENT_PASSWORD
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(
      sPasswordWithFullName
    );
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });

  it('should show error on no-full-name', () => {
    const sPasswordWithFullName = '%^UserT ';

    component.changePasswordFormGroup.controls.currentPwd.setValue(
      CURRENT_PASSWORD
    );
    component.changePasswordFormGroup.controls.newPwd.setValue(
      sPasswordWithFullName
    );
    expect(component.changePasswordFormGroup.controls.newPwd.valid).toBeFalsy();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();

    fixture.detectChanges();
    expect(clearEl.nativeElement.disabled).toBeFalsy();
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  });
});
