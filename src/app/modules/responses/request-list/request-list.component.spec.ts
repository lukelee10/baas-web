import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import {
  VettingStatusPipe,
  VettingStatusShortenPipe
} from 'src/app/core/pipes/vetting-status-shorten.pipe';
import { AppMessagesService } from 'src/app/core/services/app-messages.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { PackageRequestService } from 'src/app/core/services/package-request.service';
import {
  PackageRequestResponse,
  Request
} from 'src/app/shared/models/package-requests';
import { UserPackage } from 'src/app/shared/models/user-package';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { RequestDetailsComponent } from '../request-details/request-details.component';
import { SharedModule } from './../../../shared/shared.module';
import { RequestListComponent } from './request-list.component';

const testRequest: Request = {
  Modality: 'FACE',
  Comments: '',
  PackageId: 'fcb5f8ff-618b-4848-9dbb-7d8265f815e7',
  GlobalAccess: 1,
  Systems: ['HIGHTOP', 'LOWBALL'],
  Status: 'PENDING',
  MimeType: 'image/jpeg',
  Classification: 'U',
  Group: 'US/Virginia',
  FileName: 'Mickey-mouse.jpg',
  Created: undefined,
  Results: [],
  StatusTimestamp: undefined,
  FileSize: 23073,
  User: 'nkgroup@test.com',
  Id: 'f9a01b07-5b5e-403d-b10f-2f5d96c7a8c3',
  Name: 'AutoTest Single by GroupLead',
  ImageUrl: '../../../assets/mock-pics/Christian_Bale.jpg'
};

class MockPackageRequestService extends PackageRequestService {
  public getEndPointURL() {
    return '../../../assets/json/mock/baas-mock-requests.json';
  }

  public getPackageRequests(): Observable<PackageRequestResponse> {
    const arr = {
      count: 4,
      lastItem: '',
      requests: [
        {
          Modality: 'FACE',
          PackageId: 'fcb5f8ff-618b-4848-9dbb-7d8265f815e7',
          GlobalAccess: 1,
          Systems: ['HIGHTOP', 'LOWBALL'],
          Status: 'PENDING',
          MimeType: 'image/jpeg',
          Classification: 'U',
          Group: 'US/Virginia',
          FileName: 'Mickey-mouse.jpg',
          Created: '2019-12-04T10:04:02',
          Results: {
            LOWBALL: 'INVESTIGATIVE LEAD',
            HIGHTOP: 'PENDING'
          },
          StatusTimestamp: '2019-12-04T15:04:05.350560671279376673Z',
          FileSize: 23073,
          User: 'nkgroup@test.com',
          Id: 'f9a01b07-5b5e-403d-b10f-2f5d96c7a8c3',
          Name: 'AutoTest Single by GroupLead',
          ImageUrl: '../../../assets/mock-pics/Christian_Bale.jpg'
        },
        {
          Modality: 'FACE',
          PackageId: 'a2957d8b-cec0-4ed2-8249-4464383d09d1',
          GlobalAccess: 1,
          Systems: [, 'HIGHTOP', 'LOWBALL'],
          Status: 'INVESTIGATIVE LEAD',
          MimeType: 'image/jpeg',
          Classification: 'U',
          Group: 'US/Virginia',
          FileName: 'Mickey-mouse.jpg',
          Created: '2019-11-26T12:50:35',
          Results: {
            LOWBALL: 'INVESTIGATIVE LEAD',
            HIGHTOP: 'PENDING'
          },
          StatusTimestamp: '2019-11-26T17:50:37.26738365877762241585Z',
          FileSize: 23073,
          User: 'nkgroup@test.com',
          Id: '0f62e4c8-31f2-4887-a04e-201cf283f020',
          Name: 'AutoTest Single by GroupLead',
          ImageUrl: '../../../assets/mock-pics/Ryan_Gosling.jpg'
        },
        {
          Modality: 'FACE',
          PackageId: '094735fe-fc60-4e85-8454-133a087089fc',
          GlobalAccess: 1,
          Systems: [, 'HIGHTOP', 'LOWBALL'],
          Status: 'INVALID_STATUS',
          MimeType: 'image/jpeg',
          Classification: 'U',
          Group: 'US/Virginia',
          FileName: 'Mickey-mouse.jpg',
          Created: '2019-11-26T12:38:36',
          Results: {
            LOWBALL: 'INVALID_STATUS',

            HIGHTOP: 'PENDING'
          },
          StatusTimestamp: '2019-11-26T17:38:38.13006365180940433857Z',
          FileSize: 23073,
          User: 'nkgroup@test.com',
          Id: '6493f809-5d67-4dab-a691-5856350690be',
          Name: 'AutoTest Single by GroupLead',
          ImageUrl: '../../../assets/mock-pics/Keanu_Reeves.jpg'
        },
        {
          Modality: 'FACE',
          PackageId: '7ff648ef-da6f-4dc7-8c7f-3253cd583755',
          GlobalAccess: 1,
          Systems: [, 'HIGHTOP', 'LOWBALL'],
          Status: 'ERROR',
          MimeType: 'image/jpeg',
          Classification: 'U',
          Group: 'US/Virginia',
          FileName: 'Mickey-mouse.jpg',
          Created: '2019-11-26T12:32:41',
          Results: {
            LOWBALL: 'INVESTIGATIVE LEAD',
            HIGHTOP: 'PENDING'
          },
          StatusTimestamp: '2019-11-26T17:32:47.3583418481116905765Z',
          FileSize: 23073,
          User: 'nkgroup@test.com',
          Id: '5a7e2790-7581-4d50-bb4c-ab27e67d2260',
          Name: 'AutoTest Single by GroupLead',
          ImageUrl: '../../../assets/mock-pics/Nicolas_Cage.jpg'
        },
        {
          Modality: 'FACE',
          PackageId: '7ff648ef-da6f-4dc7-8c7f-3253cd583755',
          GlobalAccess: 1,
          Systems: [, 'HIGHTOP', 'LOWBALL'],
          Status: 'NO LEAD',
          MimeType: 'image/jpeg',
          Classification: 'U',
          Group: 'US/Virginia',
          FileName: 'Mickey-mouse.jpg',
          Created: '2019-12-26T12:32:41',
          Results: {
            LOWBALL: 'INVESTIGATIVE LEAD',
            HIGHTOP: 'PENDING'
          },
          StatusTimestamp: '2019-12-26T17:32:47.3583418481116905765Z',
          FileSize: 23073,
          User: 'nkgroup@test.com',
          Id: '5a7e2790-7581-4d50-bb4c-ab27e67d2260',
          Name: 'AutoTest Single by GroupLead',
          ImageUrl: '../../../assets/mock-pics/Matt_Damon.jpg'
        }
      ]
    };

    return (of(arr) as unknown) as Observable<PackageRequestResponse>;
  }
}

describe('RequestListComponent', () => {
  let authenticationServiceStub: Partial<AuthenticationService>;
  let component: RequestListComponent;
  let fixture: ComponentFixture<RequestListComponent>;

  authenticationServiceStub = {
    getUserLoggedIn: () => of(false)
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RequestListComponent,
        VettingStatusShortenPipe,
        VettingStatusPipe,
        RequestDetailsComponent
      ],
      imports: [
        CommonModule,
        SharedModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: PackageRequestService, useClass: MockPackageRequestService },
        { provide: AuthenticationService, useValue: authenticationServiceStub },
        NotificationService
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [RequestDetailsComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestListComponent);
    component = fixture.componentInstance;
  });

  it('should cover RequestListComponent creation', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should cover RequestListComponent ngOnChanges', () => {
    const userPackage: UserPackage = {
      PackageId: '4b492006-9102-4aed-8f67-00f3a9f8f7c4',
      Created: undefined,
      Name: undefined,
      RequestCount: undefined,
      User: undefined,
      Group: undefined
    };
    component.packageObj = userPackage;

    const spyAFunction = spyOn<any>(component, 'getRequests');
    component.ngOnChanges({
      packageObj: new SimpleChange(null, component.packageObj, true)
    });
    fixture.detectChanges();
    expect(spyAFunction.calls.any()).toBeTruthy();
  });

  it('should cover RequestListComponent ngOnChanges with nothing', () => {
    component.packageObj = undefined;

    const spyAFunction = spyOn<any>(component, 'getRequests');
    component.ngOnChanges({
      packageObj: new SimpleChange(null, component.packageObj, true)
    });
    fixture.detectChanges();
    expect(spyAFunction.calls.any()).toBeFalsy();
  });

  it('should cover RequestListComponent getRequests', () => {
    fixture.detectChanges();
    component.getRequests('32323223232');
    expect(component).toBeTruthy();
  });

  it('should cover the Service Call Failure proper handling', () => {
    const packageRequestService = fixture.debugElement.injector.get(
      PackageRequestService
    );
    const mockCall = spyOn(
      packageRequestService,
      'getPackageRequests'
    ).and.returnValue(
      // simulate the 404 error
      throwError({ status: 404 })
    );
    const mockAppMessagesService = fixture.debugElement.injector.get(
      AppMessagesService
    );
    const spymockAppMessagesService = spyOn(
      mockAppMessagesService,
      'getMessage'
    );
    fixture.detectChanges();
    component.getRequests('32323223232');
    // AppMessagesService.getMessage must be invoked to display friendly error to user
    expect(spymockAppMessagesService.calls.any()).toBeTruthy();
  });

  it('should cover RequestListComponent openDialog', () => {
    fixture.detectChanges();
    component.openDialog(testRequest);
    expect(
      component.detailsPopup.id.toString().indexOf('mat-dialog') >= 0
    ).toBeTruthy();

    expect(component).toBeTruthy();
  });

  it('should cover RequestListComponent closeDialog', () => {
    component.openDialog(testRequest);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
