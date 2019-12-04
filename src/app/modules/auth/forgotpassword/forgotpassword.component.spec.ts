import 'hammerjs'

import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material'
import { MatChipsModule } from '@angular/material/chips'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FooterComponent } from '../../../core/footer/footer.component'
import { ForgotPasswordComponent } from './forgotpassword.component'

describe('ForgotpasswordComponent', () => {
  let component: ForgotPasswordComponent
  let fixture: ComponentFixture<ForgotPasswordComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
      ],
      declarations: [FooterComponent, ForgotPasswordComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  it('Entered invalid email username', () => {
    console.log('ForgotpasswordComponent-- invalid email username Test :')
    component.email.setValue('ddddd')
    expect(component.email.invalid).toBeTruthy()
  })

  it('Entered valid email username', () => {
    console.log('ForgotpasswordComponent-- invalid email username Test :')
    component.email.setValue('ddddd@aa.com')
    expect(component.email.valid).toBeTruthy()
  })
})
