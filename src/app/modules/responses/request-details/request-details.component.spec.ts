import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import {
  VettingStatusPipe,
  VettingStatusShortenPipe
} from 'src/app/core/pipes/vetting-status-shorten.pipe';
import { AppMessagesService } from 'src/app/core/services/app-messages.services';
import { RequestDetailService } from 'src/app/core/services/request-detail.service';
import { Request } from 'src/app/shared/models/package-requests';
import { RequestDetails } from 'src/app/shared/models/request-details';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SharedModule } from './../../../shared/shared.module';
import { RequestDetailsComponent } from './request-details.component';

const TEST_REQUEST_ID = '1111-2222-3333-4444-5555';

class MockRequestDetailService extends RequestDetailService {
  public getEndPointURL() {
    return '../../../assets/json/mock/baas-mock-requests.json';
  }
  getRequestDetails() {
    const requestDetails = {
      RequestId: TEST_REQUEST_ID,
      VettingSystems: [
        {
          SystemName: 'HIGHTOP',
          POC: [
            {
              Label: 'Phone Number',
              Value: '555-555-5555',
              Remarks: 'Call me!'
            },
            {
              Label: 'Email',
              Value: 'k@abis.gov',
              Remarks: 'Contact on JWICS'
            }
          ],
          IdFieldName: 'TCN',
          Ids: ['0123445678', '82892810191'],
          Status: 'RED',
          SubmissionDate: '',
          ResponseDate: '',
          Alerts: [
            {
              Level: 'Warning',
              Message: 'ARMED, EXTREMELY DANGEROUS'
            }
          ],
          Errors: [
            {
              Code: '42',
              Message: 'Some summary of the error as returned by Vetting System'
            }
          ]
        },
        {
          SystemName: 'LOWBALL',
          POC: [
            {
              Label: 'Phone Number',
              Value: '777-777-7777',
              Remarks: 'Call me!'
            },
            {
              Label: 'Email',
              Value: 'k@tide.gov',
              Remarks: 'Contact on JWICS'
            }
          ],
          IdFieldName: 'TPN',
          Ids: ['23203230223', '43403434343'],
          Status: 'RED',
          SubmissionDate: '',
          ResponseDate: '',
          Alerts: [
            {
              Level: 'Warning',
              Message: 'ARMED'
            }
          ],
          Errors: [
            {
              Code: '42',
              Message: 'Some summary of the error as returned by Vetting System'
            }
          ]
        }
      ],
      Alert: {
        Level: 'Warning',
        Message: 'ARMED, EXTREMELY DANGEROUS'
      },
      ImageClassification: 'Request ID Classification Level (U//FOUO)',
      Modality: 'FACE',
      Filename: 'vetting-person1.jpg',
      Status: 'RED',
      RequestLogs: [
        {
          Timestamp: '20200220T232304Z',
          Message: 'Request logs sample'
        }
      ],
      ImageUrl: 'https://s3.amazonaws.com/...'
    };

    return (of(requestDetails) as unknown) as Observable<RequestDetails>;
  }
}

describe('RequestDetailsComponent', () => {
  let component: RequestDetailsComponent;
  let fixture: ComponentFixture<RequestDetailsComponent>;

  const dialogMock = {
    close: () => {}
  };

  const model: Request = {
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
    Id: TEST_REQUEST_ID,
    Name: 'AutoTest Single by GroupLead',
    ImageUrl: '../../../assets/mock-pics/Christian_Bale.jpg'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RequestDetailsComponent,
        VettingStatusShortenPipe,
        VettingStatusPipe
      ],
      imports: [
        CommonModule,
        SharedModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: model },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: RequestDetailService, useClass: MockRequestDetailService },
        NotificationService,
        AppMessagesService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDetailsComponent);
    component = fixture.componentInstance;
  });

  it('The component should be created and load data from service', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.requestDetails.RequestId === TEST_REQUEST_ID).toBeTruthy();
    expect(component.requestDetails.VettingSystems.length >= 0).toBeTruthy();
  });

  it('Verify closePopup ', () => {
    fixture.detectChanges();
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.closePopup();
    expect(spy).toHaveBeenCalled();
  });

  it('Verify the proper handling of Service Call Failure ', () => {
    const requestDetailService = fixture.debugElement.injector.get(
      RequestDetailService
    );
    const mockCall = spyOn(
      requestDetailService,
      'getRequestDetails'
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

    // AppMessagesService.getMessage must be invoked to display friendly error to user
    expect(spymockAppMessagesService.calls.any()).toBeTruthy();
  });
});
