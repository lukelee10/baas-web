import 'hammerjs';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { AwsLambdaServiceMock } from 'src/app/core/services/aws-lambda.service.spec';
import { UserService } from 'src/app/core/services/user.service';

import { LogOutComponent } from './log-out.component';

const MockAuthenticationService: Partial<AuthenticationService> = {
  Logout: () => {
    // do nothing for now, since it's supposed to have set this state to be logged out.
  }
};
class MockUserService extends UserService {
  get IsAdmin(): boolean {
    return true;
  }
  GetLatestMenuContext(v: any) {
    return true;
  }
}
describe('LogOutComponent', () => {
  let component: LogOutComponent;
  let fixture: ComponentFixture<LogOutComponent>;
  let auth: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserDynamicTestingModule,
        MatDialogModule,
        MatSnackBarModule
      ],
      declarations: [LogOutComponent],
      providers: [
        { provide: AuthenticationService, useValue: MockAuthenticationService },
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock },
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LogOutComponent);
    component = fixture.componentInstance;
    const authService = fixture.debugElement.injector.get(
      AuthenticationService
    );
    auth = spyOn(authService, 'Logout').and.returnValue();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(auth).toHaveBeenCalled();
  });
});
