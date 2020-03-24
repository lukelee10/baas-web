import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

import { UserRoles } from '../app-global-constants';
import { CoreModule } from '../core.module';
import { AuthenticationService } from '../services/authentication.service';
import { AwsLambdaService } from '../services/aws-lambda.service';
import { UserService } from '../services/user.service';
import { NavItem } from './../../shared/models/nav-item';
import { TopPageNavigationComponent } from './toppagenavigation.component';

// Mock the SortService class, its method and return it with mock data
class MockUserService extends UserService {
  get Role(): string {
    return UserRoles.NonFSPUser;
  }
  public ShowMenuSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  get IsAdmin(): boolean {
    return true;
  }
}

class AwsLambdaServiceMock extends AwsLambdaService {}
class AuthenticationServiceMock extends AuthenticationService {}

describe('TopPageNavigationComponent', () => {
  let component: TopPageNavigationComponent;
  let fixture: ComponentFixture<TopPageNavigationComponent>;
  const navItems: NavItem[] = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatTooltipModule,
        CoreModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: AwsLambdaService, useClass: AwsLambdaServiceMock }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    navItems.push({
      link: '/resources',
      title: 'Resources',
      icon: 'pages'
    });

    fixture = TestBed.createComponent(TopPageNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
