import { HttpClient } from '@angular/common/http';
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

import { BytesPipe } from '../bytes.pipe';
import { MatFileUploadQueueComponent } from '../matFileUploadQueue/matFileUploadQueue.component';
import { MatFileUploadComponent } from './matFileUpload.component';

// Mock the SortService class, its method and return it with mock data
class MockUserService extends UserService {
  get Role(): string {
    return UserRoles.NonFSPUser;
  }
}

describe('MatFileUploadComponent', () => {
  let fixtureMUC: ComponentFixture<MatFileUploadComponent>;
  let fixtureComponentMUC: MatFileUploadComponent;

  let fixtureMFU: ComponentFixture<MatFileUploadQueueComponent>;
  let fixtureComponentMFU: MatFileUploadQueueComponent;

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
      declarations: [
        MatFileUploadComponent,
        MatFileUploadQueueComponent,
        BytesPipe
      ],
      providers: [
        { provide: HttpClient, useValue: HttpTestingController },
        { provide: UserService, useClass: MockUserService },
        MatFileUploadQueueComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureMUC = TestBed.createComponent(MatFileUploadComponent);
    fixtureComponentMUC = fixtureMUC.componentInstance;
    fixtureComponentMUC.File =
      '../../../../../assets/images/baas-logo-small.png';
    fixtureMUC.detectChanges();
    fixtureMFU = TestBed.createComponent(MatFileUploadQueueComponent);
    fixtureComponentMFU = fixtureMFU.componentInstance;
    fixtureMFU.detectChanges();
  });

  it('MatFileUploadComponent Instance needs to be created', () => {
    expect(fixtureComponentMUC instanceof MatFileUploadComponent).toBe(
      true,
      'should create MatFileUploadComponent'
    );
  });
});
