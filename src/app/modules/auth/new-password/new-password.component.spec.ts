import 'hammerjs'

import { HttpClientModule } from '@angular/common/http'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'

import { CoreModule } from '../../../core/core.module'
import { SharedModule } from '../../../shared/shared.module'
import { NewPasswordComponent } from './new-password.component'

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent
  let fixture: ComponentFixture<NewPasswordComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPasswordComponent],
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    console.log('------------------------------')
  })

  it('NewPasswordComponent - Password#1 Validation Positive Test ', () => {
    console.log('NewPasswordComponent-- Password Validation Positive Test :')
    component.password.setValue('L@kkw0rd893!')
    expect(component.password.valid).toBeTruthy()
  })

  it('NewPasswordComponent - Password#1 Validation Negative Test ', () => {
    console.log('NewPasswordComponent-- Password Validation Negative Test :')
    component.password.setValue('BAD_PASSWORD')
    expect(component.password.valid).toBeFalsy()
  })

  it('NewPasswordComponent - Password#2 Validation Positive Test', () => {
    console.log('NewPasswordComponent-- Password#2 Validation Positive Test :')
    // Positive Test: password2 should be same as password
    component.password.setValue('BAD_PASSWORD')
    component.password2.setValue('BAD_PASSWORD')
    expect(component.password2.valid).toBeTruthy()
  })

  it('NewPasswordComponent - Password#2 Validation  Negative Test', () => {
    console.log('NewPasswordComponent-- Password#2 Validation Negative Test :')
    // Negative Test: password2 should be different from password
    component.password.setValue('ONE_PASSWORD')
    component.password2.setValue('DIFF_PASSWORD')
    expect(component.password2.valid).toBeFalsy()
  })
})
