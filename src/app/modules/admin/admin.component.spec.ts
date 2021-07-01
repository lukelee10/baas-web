import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabChangeEvent } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserRoles } from 'src/app/core/app-global-constants';
import { UserService } from 'src/app/core/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { AdminComponent } from './admin.component';
import { GroupManagementComponent } from './group-management/group-management.component';
import { UserManagementComponent } from './user-management/user-management.component';

// Mock the SortService class, its method and return it with mock data
class MockUserService extends UserService {
  get Role(): string {
    return UserRoles.Admin;
  }
  get UserId(): string {
    return 'admin@baas.devver1';
  }
  get Group(): string {
    return 'DEFAULT';
  }
}

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, HttpClientTestingModule],
      declarations: [
        AdminComponent,
        GroupManagementComponent,
        UserManagementComponent
      ],
      providers: [{ provide: UserService, useClass: MockUserService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should tab change correctly', done => {
    const tabChange = new MatTabChangeEvent();
    tabChange.index = 1;
    component.tabClick(tabChange);
    fixture.detectChanges();
    const bar2 = fixture.debugElement.nativeElement.querySelector(
      'mat-toolbar'
    );
    expect(bar2.textContent).toEqual('List Users');
    tabChange.index = 0;
    component.tabClick(tabChange);
    fixture.detectChanges();
    const bar = fixture.debugElement.nativeElement.querySelector('mat-toolbar');
    expect(bar).toBeTruthy();
    done();
  });
});
