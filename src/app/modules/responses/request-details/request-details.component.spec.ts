import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  VettingStatusPipe,
  VettingStatusShortenPipe
} from 'src/app/core/pipes/vetting-status-shorten.pipe';
import { Request } from 'src/app/shared/models/package-requests';

import { SharedModule } from './../../../shared/shared.module';
import { RequestDetailsComponent } from './request-details.component';

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
    Results: {
      LOWBALL: 'INVESTIGATIVE LEAD',
      HIGHTOP: 'PENDING'
    },
    StatusTimestamp: undefined,
    FileSize: 23073,
    User: 'nkgroup@test.com',
    Id: 'f9a01b07-5b5e-403d-b10f-2f5d96c7a8c3',
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
      imports: [CommonModule, SharedModule, BrowserAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: model },
        { provide: MatDialogRef, useValue: dialogMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('RequestDetailsComponent should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('Verify RequestDetailsComponent closePopup ', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.closePopup();
    expect(spy).toHaveBeenCalled();
  });
});
