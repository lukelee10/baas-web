import { UserService } from './../../../core/services/user.service';
import { AuthenticationService } from './../../../core/services/authentication.service';
import 'hammerjs';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from './../../../core/core.module';
import { SharedModule } from './../../../shared/shared.module';
import { ForgotPasswordComponent } from './../forgotpassword/forgotpassword.component';
import { LoginComponent } from './login.component';

class MockAuthenticationService extends AuthenticationService {
  AuthenticateUser(userName: string, password: string, callback: any) {
    if (password === 'good') {
      const goodResult = {
        getIdToken: () => ({
          getJwtToken: () => 'goodToken-hklshewlkhfsdlkfjiwejekw'
        })
      };
      callback.cognitoCallback(null, goodResult);
    } else {
      callback.cognitoCallback('not authentication', null);
    }
  }
  Logout() {
    // do nothing for now, since it's supposed to have set this state to be logged out.
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sessionInItSpy;
  let getEmailSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, ForgotPasswordComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.email.setValue('joegmail@test.gov');
    const userService = fixture.debugElement.injector.get(UserService);
    sessionInItSpy = spyOn(
      userService,
      'InitializeUserSession'
    ).and.returnValue();
    getEmailSpy = spyOn(component, 'getEmail').and.callThrough();
    fixture.detectChanges();
  }));

  it('LoginComponent - Email Validation - Checking Correct Email Validation', () => {
    const message = component.getErrorMessage();
    component.email.setValue('joe@gmail.com');
    expect(component.email.valid).toBeTruthy();
    expect(message).toBeFalsy();
  });

  it('LoginComponent - Email Validation - Checking Incorrect Email Validation', () => {
    component.email.setValue('joegmail');
    fixture.detectChanges();
    expect(component.email.valid).toBeFalsy();
  });

  it('should have require email error when email is empty', () => {
    component.email.setValue('');
    const message = component.getErrorMessage();
    expect(component.email.valid).toBeFalsy();
    expect(message).toContain('You must enter a value');
  });

  it('should call getEmail() and InitializeUserSession', () => {
    component.email.setValue('JOE@gmail.com');
    component.passWord.setValue('good');
    component.clickLogin();
    fixture.whenStable().then(() => {
      expect(getEmailSpy).toHaveBeenCalled();
      expect(sessionInItSpy).toHaveBeenCalled();
    });
  });

  it('login component - bad login', () => {
    component.passWord.setValue('bad');
    component.email.setValue('joegmail');
    component.clickLogin();
    fixture.whenStable().then(() => {
      expect(component.email.valid).toBeFalsy();
    });
  });
});
