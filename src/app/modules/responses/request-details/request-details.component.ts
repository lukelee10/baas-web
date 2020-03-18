import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AppMessage,
  AppMessagesService
} from 'src/app/core/services/app-messages.services';
import { RequestDetailService } from 'src/app/core/services/request-detail.service';
import { Request } from 'src/app/shared/models/package-requests';
import { RequestDetails } from 'src/app/shared/models/request-details';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {
  requestDetails: RequestDetails;
  showSpinner = true;
  constructor(
    public dialogRef: MatDialogRef<RequestDetailsComponent>,
    private requestDetailService: RequestDetailService,
    private notificationService: NotificationService,
    private appMessagesService: AppMessagesService,
    @Inject(MAT_DIALOG_DATA) public request: Request
  ) {}

  ngOnInit() {
    this.getRequestDetails(this.request.Id);
  }

  getRequestDetails(requestId: string) {
    this.showSpinner = true;
    // TODO Remove the move after the Lambda is ready
    this.requestDetailService.isMock = true;
    this.requestDetailService.requestId = requestId;
    this.notificationService.debugLogging(
      this.requestDetailService.getEndPointURL()
    );
    this.requestDetailService.getRequestDetails().subscribe(
      requestDetailsResponse => {
        this.requestDetails = requestDetailsResponse;
        this.notificationService.debugLogging(this.requestDetails);
      },
      error => {
        this.notificationService.error(
          this.appMessagesService.getMessage(AppMessage.RequestDetailsError),
          this.appMessagesService.getTitle(AppMessage.RequestDetailsError)
        );
        this.showSpinner = false;
        this.notificationService.debugLogging(error);
      },
      () => {
        this.showSpinner = false;
      }
    );
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}
