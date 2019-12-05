import 'hammerjs'

import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material'
import { MatChipsModule } from '@angular/material/chips'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, of, throwError } from 'rxjs'
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service'
import { LoaderService } from 'src/app/shared/services/loader.service'
import { NotificationService } from 'src/app/shared/services/notification.service'

import { CoreModule } from '../../../core/core.module'
import { SharedModule } from '../../../shared/shared.module'
import { NewPasswordComponent } from './new-password.component'

const kaput = '&7Uu*8Ii(9Oo'

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent
  let fixture: ComponentFixture<NewPasswordComponent>

  const AwsLambdaServiceMock: any = {
    confirmPassword(value: any): Observable<any> {
      return value.includes(kaput)
        ? throwError({ status: 404 })
        : of({ data: true })
    },
  }

  class MockRouter {
    navigate = jasmine.createSpy('navigate')
  }
  const mockRouter = new MockRouter()

  const fakeActivatedRoute = { queryParams: of({ tt: '123' }) }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPasswordComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatInputModule,
        SharedModule,
        CoreModule,
      ],
      providers: [
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock },
        { provide: Router, userValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        NotificationService,
        LoaderService,
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
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

  /*it('Pressing Submit with good password', async(() => {
    component.password.setValue('!1Qq@2Ww#3Ee')
    component.password2.setValue('!1Qq@2Ww#3Ee')
    fixture.detectChanges()
    const button = fixture.debugElement.nativeElement.querySelector('button')
    expect(button.disabled).toBeFalsy()
    debugger
    button.click()
    fixture.whenStable().then(() => {
      expect(mockRouter.navigate).toHaveBeenCalled()
    })
  }))*/
})
