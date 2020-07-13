import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Idle, IdleExpiry } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { SideNavigationComponent } from './../app/core/sidenavigation/sidenavigation.component';
import { AppComponent } from './app.component';
import { AuthenticationService } from './core/services/authentication.service';
import { TopPageNavigationComponent } from './core/toppagenavigation/toppagenavigation.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { NotificationService } from './shared/services/notification.service';

class MockExpiry extends IdleExpiry {
  public lastDate: Date;
  public mockNow: Date;

  last(value?: Date): Date {
    if (value !== void 0) {
      this.lastDate = value;
    }

    return this.lastDate;
  }

  now(): Date {
    return this.mockNow || new Date();
  }
}
class MockAuthenticationSerivce extends AuthenticationService {
  LoggedUser: any = 'Hello';
  Logout() {
    // do nothing for now, since it's supposed to have set this state to be logged out.
  }
}
describe('AppComponent', () => {
  let notificationServiceStub: Partial<NotificationService>;

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    notificationServiceStub = {};

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTooltipModule
      ],
      declarations: [
        AppComponent,
        LoaderComponent,
        SideNavigationComponent,
        TopPageNavigationComponent
      ],
      providers: [
        { provide: NotificationService, useValue: notificationServiceStub },
        { provide: AuthenticationService, useClass: MockAuthenticationSerivce },
        { provide: Idle, useClass: Idle },
        { provide: IdleExpiry, useClass: MockExpiry },
        Keepalive
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    // TODO need to beef up the testing for timeout mechanism
    // const appConst = fixture.debugElement.injector.get(
    //   AppGlobalConstants
    // );
    // spyOn(appConst, 'MaxAllowedIdleTimeInSeconds').and.returnValue(3);
    // spyOn(appConst, 'TimeOutInSeconds').and.returnValue(2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'BaaS'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('BaaS');
  });
});
