import 'hammerjs'

import { HttpClientModule } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'

import { CoreModule } from './../../../core/core.module'
import { SharedModule } from './../../../shared/shared.module'
import { ForgotPasswordComponent } from './../forgotpassword/forgotpassword.component'
import { LoginComponent } from './login.component'

describe('LoginComponent', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>

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
        RouterTestingModule.withRoutes([]),
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    console.log('------------------------------')
  }))

  it('LoginComponent should create', () => {
    console.log('LoginComponent-- Component Creation Result:')
    expect(component).toBeTruthy()
  })

  it('LoginComponent - Email Validation - Checking Correct Email Validation', () => {
    console.log(
      'LoginComponent-- Email Validation Positive Test - Correct Email TEST:'
    )
    component.email.setValue('joe@gmail.com')
    expect(component.email.valid).toBeTruthy()
  })

  it('LoginComponent - Email Validation - Checking Incorrect Email Validation', () => {
    console.log(
      'LoginComponent-- Email Validation Negative Test - Incorrect Email TEST:'
    )
    component.email.setValue('joegmail')
    expect(component.email.valid).toBeFalsy()
  })
})
