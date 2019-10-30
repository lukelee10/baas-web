import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from './../../../core/core.module';
import { LoginComponent } from './login.component';
import { SharedModule } from './../../../shared/shared.module';



describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('LoginComponent should create', () => {
    console.log('LoginComponent Creation:');
    expect(component).toBeTruthy();
  });

  it('LoginComponent - Email Validation - Checking Correct Email Validation', () => {
    console.log('LoginComponent Email:');
    component.email.setValue('joe@gmail.com');
    expect(component.email.valid).toBeTruthy();
  });

  it('LoginComponent - Email Validation - Checking Incorrect Email Validation', () => {
    console.log('LoginComponent Email:');
    component.email.setValue('joegmail');
    expect(component.email.valid).toBeFalsy();
  });
});
