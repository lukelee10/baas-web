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
import {
  FileUploadInputForDirective,
  MatFileUploadComponent,
  MatFileUploadQueueComponent
} from 'src/app/shared/components/multi-file-upload/matFileUpload';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

import { LookupStaticDataService } from '../../../shared/services/lookup-static-data.service';
import { NonFspRequestsComponent } from '../non-fsp/non-fsp-requests.component';
import { ProviderCheckboxesComponent } from '../provider-checkboxes/provider-checkboxes.component';
import { RequestsComponent } from '../requests.component';
import { FspRequestsComponent } from './fsp-requests.component';
import { Observable, of, throwError } from 'rxjs';
import { AwsLambdaService } from './../../../core/services/aws-lambda.service';
import { RequestModel } from './../../models/request-model';

// Mock the SortService class, its method and return it with mock data
// Mocking FSP User
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
describe('##RequestsComponent::(*FSP Version):', () => {
  let requestFixture: ComponentFixture<RequestsComponent>;
  let requestComponentInstance: RequestsComponent;

  const AwsLambdaServiceMock: any = {
    createRequestPackage(value: RequestModel): Observable<any> {
      return value.name === 'InvalidPackage'
        ? throwError({ status: 404 })
        : of({ data: true });
    },

    deleteRequestPackage(value: string): Observable<any> {
      return of({ data: true });
    },

    getProviders(): Observable<any> {
      return of();
    }
  };

  let fspFixture: ComponentFixture<FspRequestsComponent>;
  let fspComponentInstance: FspRequestsComponent;
  let matFileUploadQueueComponentInstance: MatFileUploadQueueComponent;

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
    const file = new File([blob], 'NotValideFile.txt', {
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

    fspFixture = TestBed.createComponent(FspRequestsComponent);
    fspComponentInstance = fspFixture.componentInstance;
    fspFixture.detectChanges();

    // Create the instance of child element by directive from the parent fixture
    matFileUploadQueueComponentInstance = fspFixture.debugElement.query(
      By.directive(MatFileUploadQueueComponent)
    ).context as MatFileUploadQueueComponent;
  });

  it('Component should create', () => {
    expect(fspComponentInstance).toBeTruthy();
  });

  // TEST valid version of component is rendered for the given role
  it('Currrent Role is FSP User, Verify FSP Version Component is Created.', () => {
    const nonFSPElement = fspFixture.debugElement.query(By.css('.fspClass'));
    expect(nonFSPElement).toBeTruthy();
  });

  // TEST invalid version of component is NOT rendered for the given role
  it('Currrent Role is FSP User, Verify Non-FSP Version Component is Not Created.', () => {
    const fspElement = fspFixture.debugElement.query(By.css('.nonFSPClass'));
    expect(fspElement).toBeFalsy();
  });

  it('Verify when form is invalid is it is empty', () => {
    expect(fspComponentInstance.form.valid).toBeFalsy();
  });

  it('Verify the form is invalid when there is no package title', () => {
    fspComponentInstance.form.setValue({ packageTitle: '' });
    fspFixture.detectChanges();

    expect(fspComponentInstance.form.valid).toBeFalsy();
  });

  it('Verify the form is valid when there is package title', () => {
    const packageTitle = 'Testing 0129 1215';
    fspComponentInstance.form.setValue({ packageTitle });
    fspFixture.detectChanges();

    expect(fspComponentInstance.form.valid).toBeTruthy();
  });

  it('Verify the form is invalid, when none of the required fields were set', () => {
    // the component has just been initilized, none of the required fields were set --> form is empty --> form is Invalid
    matFileUploadQueueComponentInstance.add(testImage());
    fspComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    expect(fspComponentInstance.IsFileUploadFormValid()).toBeTruthy();
  });

  it('Verify when no file is added, IsFileUploadFormValid must be false', () => {
    // No files are added
    fspComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    expect(fspComponentInstance.IsFileUploadFormValid()).toBeFalsy();
  });

  it('Verify when one file is added, IsFileUploadFormValid must be true', () => {
    // One file is added
    matFileUploadQueueComponentInstance.add(testImage());
    fspComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    expect(fspComponentInstance.IsFileUploadFormValid()).toBeTruthy();
  });

  it('Test UploadFilesListChanged when an invalid image is uploaded ', () => {
    // One file is added
    matFileUploadQueueComponentInstance.add(testImage());
    fspComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    fspFixture.detectChanges();
    // testImage is not valid image
    expect(fspComponentInstance.IsFileUploadFormValid()).toBeFalsy();
  });

  it('Verify when the number of files attached exceed max allowed,  IsFileUploadFormValid must be false ', () => {
    // add MaxFileCountForPackage + 2 files
    for (let i = 0; i < environment.MaxFileCountForPackage + 2; i++) {
      matFileUploadQueueComponentInstance.add(testImage());
    }
    fspComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    fspFixture.detectChanges();
    expect(fspComponentInstance.IsFileUploadFormValid()).toBeFalsy();
  });

  it('Verify on submit prepareThePackage method is called', () => {
    // One file is added
    matFileUploadQueueComponentInstance.add(testImage());
    fspComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    const prepareThePackageSpy = spyOn(
      fspComponentInstance,
      'prepareThePackage'
    );
    fspComponentInstance.onSubmitRequest();
    expect(prepareThePackageSpy).toHaveBeenCalled();
  });

  it('Verify on submit submitThePackage method is called when one file added', () => {
    // One file is added
    matFileUploadQueueComponentInstance.add(testImage());
    fspComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    fspFixture.detectChanges();
    const submitThePackageSpy = spyOn(fspComponentInstance, 'submitThePackage');
    fspComponentInstance.onSubmitRequest();
    expect(submitThePackageSpy).toHaveBeenCalled();
  });

  it('Verify on submit submitThePackage method is called when multiple files added', () => {
    // two files are added
    matFileUploadQueueComponentInstance.add(testImage());
    matFileUploadQueueComponentInstance.add(testImage());

    fspComponentInstance.UploadFilesListChanged(
      matFileUploadQueueComponentInstance.getQueueData()
    );
    fspFixture.detectChanges();
    const submitThePackageSpy = spyOn(fspComponentInstance, 'submitThePackage');
    fspComponentInstance.onSubmitRequest();
    expect(submitThePackageSpy).toHaveBeenCalled();
  });

  it('Submit button not active when there is no file modality type', async(() => {
    fspComponentInstance.form.setValue({ packageTitle: 'Testing 0203 1024' });
    matFileUploadQueueComponentInstance.add(testImage());
    fspFixture.detectChanges();
    const button = fspFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeTruthy();
  }));

  it('Submit button not active when there is invalid file', async(() => {
    fspComponentInstance.form.setValue({ packageTitle: 'Testing 0203 1024' });
    matFileUploadQueueComponentInstance.add(invalidFile());
    fspFixture.detectChanges();
    const button = fspFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeTruthy();
  }));

  it('Submit button active when all valid data on the page', async(() => {
    fspComponentInstance.form.setValue({ packageTitle: 'Testing 0203 1024' });
    matFileUploadQueueComponentInstance.add(testImage());
    fspFixture.detectChanges();

    matFileUploadQueueComponentInstance.fileUploads.first.fileUploadFormGroup.setValue(
      {
        modalityControl: 'Face',
        isNotUSPerson: true
      }
    );
    fspFixture.detectChanges();

    const button = fspFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeFalsy();
  }));

  it('Pressing Submit with valid data make sure call the mock service', async(() => {
    fspComponentInstance.form.setValue({ packageTitle: 'Testing 0203 1024' });
    matFileUploadQueueComponentInstance.add(testImage());
    fspFixture.detectChanges();

    matFileUploadQueueComponentInstance.fileUploads.first.fileUploadFormGroup.setValue(
      {
        modalityControl: 'Face',
        isNotUSPerson: true
      }
    );
    fspFixture.detectChanges();

    const button = fspFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeFalsy();
    button.click();
  }));

  it('Pressing Submit with valid data make sure call the mock service to throw error', async(() => {
    fspComponentInstance.form.setValue({ packageTitle: 'InvalidPackage' });
    matFileUploadQueueComponentInstance.add(testImage());
    fspFixture.detectChanges();

    matFileUploadQueueComponentInstance.fileUploads.first.fileUploadFormGroup.setValue(
      {
        modalityControl: 'Face',
        isNotUSPerson: true
      }
    );
    fspFixture.detectChanges();

    const button = fspFixture.debugElement.nativeElement.querySelectorAll(
      'button'
    )[0];
    expect(button.disabled).toBeFalsy();
    button.click();
  }));
});
