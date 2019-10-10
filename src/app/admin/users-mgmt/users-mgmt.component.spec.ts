import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMgmtComponent } from './users-mgmt.component';

describe('UsersMgmtComponent', () => {
  let component: UsersMgmtComponent;
  let fixture: ComponentFixture<UsersMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
