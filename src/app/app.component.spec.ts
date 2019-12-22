import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LoaderComponent } from './shared/components/loader/loader.component';
import { SideNavigationComponent } from './../app/core/sidenavigation/sidenavigation.component';
import { TopPageNavigationComponent } from './core/toppagenavigation/toppagenavigation.component';

import { AuthenticationService } from './core/services/authentication.service';
import { NotificationService } from './shared/services/notification.service';

describe('AppComponent', () => {
  let authenticationServiceStub: Partial<AuthenticationService>;
  let notificationServiceStub: Partial<NotificationService>;
  const idleStub: Partial<Idle> = null;
  const keepaliveStub: Partial<Keepalive> = null;

  beforeEach(async(() => {
    authenticationServiceStub = {};
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
        { provide: AuthenticationService, useValue: authenticationServiceStub },
        { provide: Idle, useValue: idleStub },
        { provide: Keepalive, useValue: keepaliveStub }
      ]
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'BaaS'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('BaaS');
  });
});
