import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule,
  MatCardModule,
  MatProgressBarModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserRoles } from 'src/app/core/app-global-constants';
import { UserService } from 'src/app/core/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatFileUploadQueueComponent } from '../matFileUploadQueue/matFileUploadQueue.component';
import { MatFileUploadComponent } from './matFileUpload.component';

// Mock the SortService class, its method and return it with mock data
class MockUserService extends UserService {
  get Role(): string {
    return UserRoles.NonFSPUser;
  }
}
// MockMatFileUploadQueueComponent
class MockMatFileUploadQueueComponent {}

describe('MatFileUploadComponent', () => {
  let fixtureMUC: ComponentFixture<MatFileUploadComponent>;
  let fixtureComponentMUC: MatFileUploadComponent;
  let httpClient: HttpTestingController;
  const fileUploadUrl = 'http://.../mock/upload';
  const fileName = 'IMG-353.jpeg';
  const fileType = 'image/jpeg';

  beforeEach(async(() => {
    // TestBed is the main utility available for Angular-specific testing.
    // TestBed.configureTestingModule in your test suite’s beforeEach block and give -
    // -it an object with similar values as a regular NgModule for declarations, providers and imports
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatProgressBarModule,
        MatIconModule,
        BrowserAnimationsModule,
        SharedModule,
        MatCardModule,
        HttpClientTestingModule
      ],
      declarations: [MatFileUploadComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        {
          provide: MatFileUploadQueueComponent,
          useClass: MockMatFileUploadQueueComponent
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureMUC = TestBed.createComponent(MatFileUploadComponent);
    fixtureComponentMUC = fixtureMUC.componentInstance;
    // Assign a Image
    fixtureComponentMUC.File = new File(['Foo34'], fileName, {
      type: fileType
    });

    fixtureComponentMUC.FileUploadUrl = fileUploadUrl;
    fixtureMUC.detectChanges();
    httpClient = TestBed.get(HttpTestingController);
  });

  it('MatFileUploadComponent Instance needs to be created', () => {
    expect(fixtureComponentMUC instanceof MatFileUploadComponent).toBe(
      true,
      'should create MatFileUploadComponent'
    );
  });

  it('Testing the file size', () => {
    expect(fixtureComponentMUC.IsFileValidSize()).toBe(
      true,
      'File size must be valid'
    );
  });

  it('Testing the big file size', () => {
    fixtureComponentMUC.File = new File(
      [new Array(10 * 1024 * 1050).join('x')],
      'IMG-3573.jpeg',
      {
        type: 'text/plain'
      }
    );
    expect(fixtureComponentMUC.IsFileValidSize()).toBe(
      false,
      'Big file size must be invalid'
    );
  });

  it('Verify Upload method calls HTTP put method', async(() => {
    fixtureComponentMUC.upload().subscribe(data => {});

    const mockReq = httpClient.expectOne(fileUploadUrl);
    expect(mockReq.request.method).toEqual('PUT');
    expect(mockReq.request.body.name).toContain(fileName);
    expect(mockReq.request.body.type).toContain(fileType);
    expect(mockReq.cancelled).toBeFalsy();
    httpClient.verify();
    fixtureComponentMUC.remove();
  }));

  it('Verify the form valid with right file attached', () => {
    fixtureComponentMUC.fileUploadFormGroup.get('modality').setErrors(null);
    expect(fixtureComponentMUC.IsFormValid()).toBe(
      true,
      'Form must be valid with right image file and modality'
    );
  });

  it('Verify the form invalid with incorrect image file', () => {
    fixtureComponentMUC.File = new File(['Foo35'], 'hello-world.docx', {
      type: 'text/plain'
    });
    fixtureMUC.detectChanges();
    expect(fixtureComponentMUC.IsFormValid()).toBe(
      false,
      'Form must be valid with right image file and modality'
    );
  });

  it('Verify function GetPackageFileModel, File Name must not be empty after image is set', () => {
    const pm = fixtureComponentMUC.GetPackageFileModel();
    expect(pm.FileName.length > 0).toBe(
      true,
      'File Name must not be empty after image is set'
    );
  });

  it('Verify the proper read FileUploadUrl property', () => {
    const url = String(fixtureComponentMUC.FileUploadUrl);
    expect(url.length > 0).toBe(
      true,
      'A valid FileUploadUrl String must be returned'
    );
  });

  it('Verify the proper read Id property', () => {
    const id = String(fixtureComponentMUC.Id);
    expect(id.length > 0).toBe(true, 'A valid Id String must be returned');
  });
});
