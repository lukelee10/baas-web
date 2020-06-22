import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';

import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
