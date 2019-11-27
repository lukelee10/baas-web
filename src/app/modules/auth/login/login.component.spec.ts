import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from './../../../core/core.module';
import { LoginComponent } from './login.component';
import { SharedModule } from './../../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('LoginComponent - Email Validation - Checking Correct Email Validation', () => {
    component.email.setValue('joe@gmail.com');
    expect(component.email.valid).toBeTruthy();
  });

  it('LoginComponent - Email Validation - Checking Incorrect Email Validation', () => {
    component.email.setValue('joegmail');
    expect(component.email.valid).toBeFalsy();
  });
});
