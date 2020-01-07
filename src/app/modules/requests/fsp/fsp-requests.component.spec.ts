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

import { NonFspRequestsComponent } from '../non-fsp/non-fsp-requests.component';
import { RequestsComponent } from '../requests.component';
import { FspRequestsComponent } from './fsp-requests.component';

// Mock the SortService class, its method and return it with mock data
class MockUserService extends UserService {
  get Role(): string {
    return UserRoles.FSPUser;
  }
}

describe('RequestsComponent - (*FSP VERSION)', () => {
  let requestComponent: RequestsComponent;
  let fixture: ComponentFixture<RequestsComponent>;

  let fspComponent: FspRequestsComponent;
  let fixture2: ComponentFixture<FspRequestsComponent>;

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

    fixture2 = TestBed.createComponent(FspRequestsComponent);
    fspComponent = fixture2.componentInstance;
    fixture2.detectChanges();
  });

  // TEST valid version of component is rendered for the given role
  it('Currrent Role is FSP User, Verrify FSP Version Component is Created.', () => {
    const nonFSPElement = fixture.debugElement.query(By.css('.fspClass'));
    expect(nonFSPElement).toBeTruthy();
  });

  // TEST invalid version of component is NOT rendered for the given role
  it('Currrent Role is FSP User, Verrify Non-FSP Version Component is Not Created.', () => {
    const fspElement = fixture.debugElement.query(By.css('.nonFSPClass'));
    expect(fspElement).toBeFalsy();
  });

  it('FSP User Form Invalid when empty', () => {
    expect(fspComponent.form.valid).toBeFalsy();
  });
});
