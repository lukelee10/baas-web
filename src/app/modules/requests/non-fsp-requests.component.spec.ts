import 'hammerjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserRoles } from 'src/app/core/app-global-constants';
import { UserService } from 'src/app/core/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { FspRequestsComponent } from './fsp-requests.component';
import { NonFspRequestsComponent } from './non-fsp-requests.component';
import { RequestsComponent } from './requests.component';

// Mock the SortService class, its method and return it with mock data
class MockUserService extends UserService {
  get Role(): string {
    return UserRoles.NonFSPUser;
  }
}

describe('RequestsComponent - (*NON-FSP Version)', () => {
  let requestComponent: RequestsComponent;
  let fixture: ComponentFixture<RequestsComponent>;

  let nonFSPComponent: NonFspRequestsComponent;
  let fixture2: ComponentFixture<NonFspRequestsComponent>;

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
        SharedModule,
        MatSnackBarModule
      ],
      declarations: [
        RequestsComponent,
        NonFspRequestsComponent,
        FspRequestsComponent
      ],
      providers: [{ provide: UserService, useClass: MockUserService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsComponent);
    requestComponent = fixture.componentInstance;
    fixture.detectChanges();

    fixture2 = TestBed.createComponent(NonFspRequestsComponent);
    nonFSPComponent = fixture2.componentInstance;
    fixture2.detectChanges();
  });

  // TEST valid version of component is rendered for the given role
  it('Currrent Role is Non-FSP User, Verrify Non-FSP Version Component is Created.', () => {
    const nonFSPElement = fixture.debugElement.query(By.css('.nonFSPClass'));
    expect(nonFSPElement).toBeTruthy();
  });

  // TEST invalid version of component is NOT rendered for the given role
  it('Currrent Role is Non-FSP User, Verrify FSP Version Component is Not Created.', () => {
    const fspElement = fixture.debugElement.query(By.css('.fspClass'));
    expect(fspElement).toBeFalsy();
  });

  it('Non-FSP User Form Invalid when empty', () => {
    expect(nonFSPComponent.form.valid).toBeFalsy();
  });
});
