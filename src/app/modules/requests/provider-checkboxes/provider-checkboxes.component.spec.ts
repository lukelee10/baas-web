import 'hammerjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import {
  FileUploadInputForDirective,
  MatFileUploadComponent,
  MatFileUploadQueueComponent
} from 'src/app/shared/components/multi-file-upload/matFileUpload';
import { SharedModule } from 'src/app/shared/shared.module';

import { FspRequestsComponent } from '../fsp/fsp-requests.component';
import { NonFspRequestsComponent } from '../non-fsp/non-fsp-requests.component';
import { RequestsComponent } from '../requests.component';
import { ProviderCheckboxesComponent } from './provider-checkboxes.component';

// Mock the AwsLambdaService class, its method and return it with mock data
class MockAwsLambdaService extends AwsLambdaService {
  getProviders(): Observable<any> {
    const arr = {
      Items: [
        {
          ProviderId: 'ABIS',
          AdapterId: 'ABIS',
          Description: 'ABIS Biometrics Provider'
        },
        {
          ProviderId: 'TIDE',
          AdapterId: 'HIGH',
          Description: 'TIDE Biometrics Provider',
          IdInAdapter: '1'
        },
        {
          ProviderId: 'HIGHTOP',
          AdapterId: 'HIGH',
          Description: 'HIGHTOP Biometrics Provider',
          IdInAdapter: '2'
        },
        {
          ProviderId: 'LOWBALL',
          AdapterId: 'LOWBALL',
          Description: 'LOWBALL Biometrics Provider'
        }
      ],
      Count: 4
    };

    return of(arr);
  }
}

// Test Suite: describe blocks define a test suite
// Each 'it' block within a test suite carries an individual test.
describe('##Vetting Systems (Provider) Checkboxes Control:', () => {
  let providerComponentFixture: ComponentFixture<ProviderCheckboxesComponent>;
  let providerComponentInstance: ProviderCheckboxesComponent;

  // beforeEach runs before each individual test and is used for the setup part of a test.
  // Wrapping the callback function of a test or the first argument of beforeEach with 'async'
  // allows Angular to perform asynchronous compilation and wait until the content inside of the async block to be ready before continuing.
  beforeEach(async(() => {
    // TestBed is the main utility available for Angular-specific testing.
    // TestBed.configureTestingModule in your test suite’s beforeEach block and give -
    // -it an object with similar values as a regular NgModule for declarations, providers and imports
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
        FspRequestsComponent,
        ProviderCheckboxesComponent,
        FileUploadInputForDirective,
        MatFileUploadComponent,
        MatFileUploadQueueComponent
      ],
      providers: [{ provide: AwsLambdaService, useClass: MockAwsLambdaService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Create a component(s) requestComponentInstance that you are about to test with TestBed.createComponent.
    // Fixtures have access to a debugElement, which will give you access to the internals of the component requestComponentInstance.
    providerComponentFixture = TestBed.createComponent(
      ProviderCheckboxesComponent
    );
    providerComponentInstance = providerComponentFixture.componentInstance;
    providerComponentFixture.whenStable().then(() => {
      providerComponentFixture.detectChanges(); // will trigger ngOnInit
    });
  });

  it('Test Providers Lambdacall on ngOnInit', async(() => {
    providerComponentFixture.detectChanges();
    providerComponentFixture.whenStable().then(() => {
      expect(providerComponentInstance.providersViewModel.length).toEqual(4);
    });
  }));

  it('Test isValidForm to be False when none of the vetting system selected', async(() => {
    providerComponentFixture.detectChanges();
    providerComponentFixture.whenStable().then(() => {
      expect(providerComponentInstance.isValidForm()).toBeFalsy();
    });
  }));

  it('Form is Valid upon selection one more vetting system', async(() => {
    providerComponentFixture.whenStable().then(() => {
      providerComponentInstance.toggleAllSelection();
      const isFormValid = providerComponentInstance.isValidForm();
      expect(isFormValid).toBeTruthy();
    });
  }));

  it('Verify the form is valid, when all the vetting systems selected', async(() => {
    providerComponentFixture.whenStable().then(() => {
      const privateSpy = spyOn<any>(providerComponentInstance, 'isValidForm');
      // toggleAllSelection(): Will select all the vetting systems
      // If one or more vetting system is selected then the form is valid.
      providerComponentInstance.toggleAllSelection();
      providerComponentFixture.detectChanges();
      expect(providerComponentInstance.isValidForm).toHaveBeenCalled();
    });
  }));
});
