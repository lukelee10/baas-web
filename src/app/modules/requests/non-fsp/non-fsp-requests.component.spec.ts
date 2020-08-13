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
import { Observable, of, throwError } from 'rxjs';
import { Guid } from 'guid-typescript';
import { UserRoles } from 'src/app/core/app-global-constants';
import { UserService } from 'src/app/core/services/user.service';
import {
  FileUploadInputForDirective,
  MatFileUploadComponent,
  MatFileUploadQueueComponent
} from 'src/app/shared/components/multi-file-upload/matFileUpload';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

import { Provider } from '../../../shared/models/provider';
import { FspRequestsComponent } from '../fsp/fsp-requests.component';
import { ProviderCheckboxesComponent } from '../provider-checkboxes/provider-checkboxes.component';
import { RequestsComponent } from '../requests.component';
import { AwsLambdaService } from './../../../core/services/aws-lambda.service';
import { LookupStaticDataService } from './../../../shared/services/lookup-static-data.service';
import {
  PackageModel,
  SavedPackageModel,
  SavedRequestModel
} from './../../models/request-model';
import { NonFspRequestsComponent } from './non-fsp-requests.component';

// Mock the SortService class, its method and return it with mock data
class MockUserService extends UserService {
  get Role(): string {
    return UserRoles.NonFSPUser;
  }
  get UserId(): string {
    return 'admin@baas.devver1';
  }
  get Group(): string {
    return 'DEFAULT';
  }
}

// Test Suite: describe blocks define a test suite
// Each "it" block within a test suite carries an individual test.
describe('RequestsComponent::(*NON-FSP Version)', () => {
  let requestFixture: ComponentFixture<RequestsComponent>;
  let requestComponentInstance: RequestsComponent;
  const INVALID_PACKAGE_TITLE = 'InvalidPackage';

  const AwsLambdaServiceMock: any = {
    createRequestPackage(value: PackageModel): Observable<any> {
      if (!value || value.packageName === INVALID_PACKAGE_TITLE) {
        return throwError({ status: 404 });
      }
      // Else, we need to return something intelligent.
      const respData: SavedPackageModel = {
        PackageId: Guid.create().toString(),
        Requests: new Array(value.requests.length).fill(null).map(() => ({
          RequestId: Guid.create().toString(),
          UploadUrl: ''
        }))
      };
      return of(respData);
    },

    deleteRequestPackage(value: string): Observable<any> {
      return of({ data: true });
    },

    getProviders(): Observable<any> {
      return of();
    }
  };

  let nonFSPFixture: ComponentFixture<NonFspRequestsComponent>;
  let nonFSPComponentInstance: NonFspRequestsComponent;

  let matFileUploadQueueComponentInstance: MatFileUploadQueueComponent;
  let providerCheckboxesComponent: ProviderCheckboxesComponent;

  const mockSelectedProviders: Provider[] = [];

  const testImage = (): File => {
    // prettier-ignore
    const data = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 8, 0,
        0, 0, 8, 8, 2, 0, 0, 0, 75, 109, 41, 220,  0,  0,  0,  34,  73,  68,  65,  84,
        8,  215,  99,  120,  173,  168,  135,  21,  49,  0,  241,  255,  15,  90,  104,
        8,  33,  129,  83,  7,  97,  163,  136,  214,  129,  93,  2,  43,  2,  0,  181,
        31,  90,  179,  225,  252,  176,  37,  0,  0,  0,  0,  73,  69,  78,  68,  174,
        66,  96,  130
    ]);
    const blob = new Blob([data]);
    const file = new File([blob], 'sample.png', {
      type: 'image/png',
      lastModified: Date.now()
    });
    return file;
  };

  const invalidFile = (): File => {
    // prettier-ignore
    const data = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 8, 0,
        0, 0, 8, 8, 2, 0, 0, 0, 75, 109, 41, 220,  0,  0,  0,  34,  73,  68,  65,  84,
        8,  215,  99,  120,  173,  168,  135,  21,  49,  0,  241,  255,  15,  90,  104,
        8,  33,  129,  83,  7,  97,  163,  136,  214,  129,  93,  2,  43,  2,  0,  181,
        31,  90,  179,  225,  252,  176,  37,  0,  0,  0,  0,  73,  69,  78,  68,  174,
        66,  96,  130
    ]);
    const blob = new Blob([data]);
    const file = new File([blob], 'NotValidFile.txt', {
      type: 'text/plain',
      lastModified: Date.now()
    });
    return file;
  };

  // beforeEach runs before each individual test and is used for the setup part of a test.
  // Wrapping the callback function of a test or the first argument of beforeEach with "async"
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
        MatFileUploadQueueComponent,
        MatFileUploadComponent,
        FileUploadInputForDirective
      ],
      providers: [
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock },
        { provide: UserService, useClass: MockUserService },
        LookupStaticDataService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Create a component(s) requestComponentInstance that you are about to test with TestBed.createComponent.
    // Fixtures have access to a debugElement, which will give you access to the internals of the component requestComponentInstance.
    requestFixture = TestBed.createComponent(RequestsComponent);
    requestComponentInstance = requestFixture.componentInstance;
    requestFixture.detectChanges();

    nonFSPFixture = TestBed.createComponent(NonFspRequestsComponent);
    nonFSPComponentInstance = nonFSPFixture.componentInstance;

    // Create the instance of child element by directive from the parent fixture
    matFileUploadQueueComponentInstance = nonFSPFixture.debugElement.query(
      By.directive(MatFileUploadQueueComponent)
    ).context as MatFileUploadQueueComponent;

    providerCheckboxesComponent = nonFSPFixture.debugElement.query(
      By.directive(ProviderCheckboxesComponent)
    ).context as ProviderCheckboxesComponent;

    nonFSPFixture.detectChanges();
  });

  it('Component should create', () => {
    expect(nonFSPComponentInstance).toBeTruthy();
  });

  // TEST valid version of component is rendered for the given role
  it('Current Role is Non-FSP User, Verify Non-FSP Version Component is Created', () => {
    const nonFSPElement = nonFSPFixture.debugElement.query(
      By.css('.nonFSPClass')
    );
    expect(nonFSPElement).toBeTruthy();
  });

  // TEST invalid version of component is NOT rendered for the given role
  it('Current Role is Non-FSP User, Verify FSP Version Component is Not Created', () => {
    const fspElement = nonFSPFixture.debugElement.query(By.css('.fspClass'));
    expect(fspElement).toBeFalsy();
  });

  it('Verify the form is invalid, when none of the required fields were set', () => {
    // the component has just been initialized, none of the required fields were set --> form is empty --> form is Invalid
    expect(nonFSPComponentInstance.form.valid).toBeFalsy();
  });

  it('Verify when no file is added, IsFileUploadFormValid must be false', () => {
    // No files are added
    nonFSPComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    expect(nonFSPComponentInstance.IsFileUploadFormValid()).toBeFalsy();
  });

  it('Verify when one file is added, IsFileUploadFormValid must be true', () => {
    // One file is added
    matFileUploadQueueComponentInstance.add(testImage());
    nonFSPComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    expect(nonFSPComponentInstance.IsFileUploadFormValid()).toBeTruthy();
  });

  it('Test UploadFilesListChanged when an invalid image is uploaded ', () => {
    // One file is added
    matFileUploadQueueComponentInstance.add(testImage());
    nonFSPComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    nonFSPFixture.detectChanges();
    // testImage is not valid image
    expect(nonFSPComponentInstance.IsFileUploadFormValid()).toBeFalsy();
  });

  it('Verify when the number of files attached exceed max allowed,  IsFileUploadFormValid must be false ', () => {
    // add MaxFileCountForPackage + 1 files
    for (let i = 0; i < environment.MaxFileCountForPackage + 1; i++) {
      matFileUploadQueueComponentInstance.add(testImage());
    }
    nonFSPComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    nonFSPFixture.detectChanges();
    expect(nonFSPComponentInstance.IsFileUploadFormValid()).toBeFalsy();
  });

  it('Test ProvidersSelectionChanged Event Triggered When One Provider Selected ', () => {
    // mock one vetting system is selected
    mockSelectedProviders.push({
      ProviderId: 'HIGHTOP',
      AdapterId: 'HIGHTOP',
      Description: 'HIGHTOP Biometrics Provider'
    });
    nonFSPComponentInstance.ProvidersSelectionChanged(mockSelectedProviders);
    // When ProvidersSelectionChanged Event Triggered nonFSPComponentInstance.vettingSystems.length must be greater than 0
    expect(nonFSPComponentInstance.vettingSystems.length > 0).toBeTruthy();
  });

  it('Verify on submit prepareThePackage method is called', () => {
    // One file is added
    matFileUploadQueueComponentInstance.add(testImage());
    nonFSPComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    const prepareThePackageSpy = spyOn(
      nonFSPComponentInstance,
      'prepareThePackage'
    );
    nonFSPComponentInstance.onSubmitRequest();
    expect(prepareThePackageSpy).toHaveBeenCalled();
  });

  it('Verify on submit submitThePackage method is called when one file added', () => {
    // One file is added
    matFileUploadQueueComponentInstance.add(testImage());
    nonFSPComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    nonFSPFixture.detectChanges();
    const submitThePackageSpy = spyOn(
      nonFSPComponentInstance,
      'submitThePackage'
    );
    nonFSPComponentInstance.onSubmitRequest();
    expect(submitThePackageSpy).toHaveBeenCalled();
  });

  it('Verify on submit submitThePackage method is called when multiple files added', () => {
    // two files are added
    matFileUploadQueueComponentInstance.add(testImage());
    matFileUploadQueueComponentInstance.add(testImage());

    nonFSPComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    nonFSPFixture.detectChanges();
    const submitThePackageSpy = spyOn(
      nonFSPComponentInstance,
      'submitThePackage'
    );
    nonFSPComponentInstance.onSubmitRequest();
    expect(submitThePackageSpy).toHaveBeenCalled();
  });

  it('Submit button not active when there is no data on Non FSP page', async(() => {
    nonFSPFixture.detectChanges();
    const button = nonFSPFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeTruthy();
  }));

  it('Submit button not active when there are no files for package on Non FSP page', async(() => {
    nonFSPComponentInstance.form.setValue({
      packageTitle: 'Testing 0203 0120',
      packageClassification: 'U'
    });

    nonFSPFixture.detectChanges();
    const button = nonFSPFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeTruthy();
  }));

  it('Submit button not active when there is no file modality for package on Non FSP page', async(() => {
    nonFSPComponentInstance.form.setValue({
      packageTitle: 'Testing 0203 0120',
      packageClassification: 'U'
    });
    nonFSPFixture.detectChanges();

    matFileUploadQueueComponentInstance.add(testImage());

    const button = nonFSPFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeTruthy();
  }));

  it('Submit button not active when there is invalid file for package on Non FSP page', async(() => {
    nonFSPComponentInstance.form.setValue({
      packageTitle: 'Testing 0203 0120',
      packageClassification: 'U'
    });
    matFileUploadQueueComponentInstance.add(invalidFile());
    nonFSPFixture.detectChanges();
    const button = nonFSPFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeTruthy();
  }));

  it('Submit button is not active when there is no vetting system selected on Non FSP page', async(() => {
    nonFSPComponentInstance.form.setValue({
      packageTitle: 'Testing 0203 0120',
      packageClassification: 'U'
    });
    matFileUploadQueueComponentInstance.add(testImage());
    nonFSPFixture.detectChanges();

    matFileUploadQueueComponentInstance.fileUploads.first.fileUploadFormGroup.setValue(
      {
        modality: 'Face',
        isNotUSPerson: true,
        imageClassification: 'U'
      }
    );
    nonFSPFixture.detectChanges();

    const button = nonFSPFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeTruthy();
  }));

  it('Submit button is active when all required data met on Non FSP page', async(() => {
    nonFSPComponentInstance.form.setValue({
      packageTitle: 'Testing 0203 0120',
      packageClassification: 'U'
    });
    nonFSPComponentInstance.vettingSystems.push('LOWBALL');
    matFileUploadQueueComponentInstance.add(testImage());
    nonFSPFixture.detectChanges();

    matFileUploadQueueComponentInstance.fileUploads.first.fileUploadFormGroup.setValue(
      {
        modality: 'Face',
        isNotUSPerson: true,
        imageClassification: 'U'
      }
    );
    nonFSPFixture.detectChanges();

    const button = nonFSPFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeFalsy();
  }));

  it('Pressing Submit on Non FSP page with valid data make sure call the mock service', async(() => {
    nonFSPComponentInstance.form.setValue({
      packageTitle: 'Testing 0203 0120',
      packageClassification: 'U'
    });
    nonFSPComponentInstance.vettingSystems.push('LOWBALL');
    matFileUploadQueueComponentInstance.add(testImage());
    nonFSPFixture.detectChanges();

    matFileUploadQueueComponentInstance.fileUploads.first.fileUploadFormGroup.setValue(
      {
        modality: 'Face',
        isNotUSPerson: true,
        imageClassification: 'U'
      }
    );
    nonFSPFixture.detectChanges();

    const button = nonFSPFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeFalsy();
    button.click();
  }));

  it('Pressing Submit with valid data calls the uploadFilesToS3', async(() => {
    nonFSPComponentInstance.form.setValue({
      packageTitle: 'Testing 0206 0150',
      packageClassification: 'U'
    });
    nonFSPComponentInstance.vettingSystems.push('LOWBALL');
    matFileUploadQueueComponentInstance.add(testImage());
    nonFSPFixture.detectChanges();

    matFileUploadQueueComponentInstance.fileUploads.first.fileUploadFormGroup.setValue(
      {
        modality: 'Face',
        isNotUSPerson: true,
        imageClassification: 'U'
      }
    );
    nonFSPFixture.detectChanges();

    const uploadFilesToS3Spy = spyOn(
      nonFSPComponentInstance,
      'uploadFilesToS3'
    );

    const button = nonFSPFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeFalsy();
    button.click();

    expect(uploadFilesToS3Spy).toHaveBeenCalled();
  }));

  it('Pressing Submit with valid data make sure call the mock service to throw error', async(() => {
    nonFSPComponentInstance.form.setValue({
      packageTitle: INVALID_PACKAGE_TITLE,
      packageClassification: 'U'
    });
    nonFSPComponentInstance.vettingSystems.push('LOWBALL');
    matFileUploadQueueComponentInstance.add(testImage());
    nonFSPFixture.detectChanges();

    matFileUploadQueueComponentInstance.fileUploads.first.fileUploadFormGroup.setValue(
      {
        modality: 'Face',
        isNotUSPerson: true,
        imageClassification: 'U'
      }
    );
    nonFSPFixture.detectChanges();

    const button = nonFSPFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeFalsy();
    button.click();
  }));

  it('Should be dirty after put in form values', async(() => {
    // not set the form, not set the files.
    nonFSPComponentInstance.vettingSystems.push('LOWBALL');
    nonFSPFixture.detectChanges();

    expect(nonFSPComponentInstance.isDirty()).toBeTruthy();
  }));
});
