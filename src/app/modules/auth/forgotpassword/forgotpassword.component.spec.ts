import 'hammerjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { FooterComponent } from '../../../core/footer/footer.component';
import { ForgotPasswordComponent } from './forgotpassword.component';

const kaput = 'goKaput';

describe('ForgotpasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  const AwsLambdaServiceMock: any = {
    resetPassword(value: any): Observable<any> {
      return value.includes(kaput)
        ? throwError({ status: 404 })
        : of({ data: true });
    }
  };

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
        RouterTestingModule.withRoutes([])
      ],
      declarations: [FooterComponent, ForgotPasswordComponent],
      providers: [
        LoaderService,
        NotificationService,
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock }
      ]
    }).compileComponents();
    // .then(() => {
    //  fixture = TestBed.createComponent(ForgotPasswordComponent)
    //  component = fixture.componentInstance
    //  component.email.setValue('ddddd@aa.com')
    //  fixture.detectChanges()
    // })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Entered valid email username', () => {
    console.log('ForgotpasswordComponent-- invalid email username Test :');
    component.email.setValue('ddddd@aa.com');
    expect(component.email.valid).toBeTruthy();
  });

  it('Pressing Submit with good email', async(() => {
    component.email.setValue('ddddd@aa.com');
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalsy();
    button.click();
    fixture.whenStable().then(() => {
      expect(component.message).toBeDefined();
    });
  }));

  it('Entered invalid email username', () => {
    component.email.setValue('ddddd');
    expect(component.email.invalid).toBeTruthy();
  });

  it('Pressing Submit but system failed', async(() => {
    component.email.setValue(kaput + '@aa.com');
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalsy();
    button.click();
    fixture.whenStable().then(() => {
      expect(component.errorMessage).toBeDefined();
    });
  }));
});
