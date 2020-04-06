import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AppMessage,
  AppMessagesService
} from 'src/app/core/services/app-messages.service';
import { RequestDetailService } from 'src/app/core/services/request-detail.service';
import { Request } from 'src/app/shared/models/package-requests';
import { RequestDetails } from 'src/app/shared/models/request-details';
import { NotificationService } from 'src/app/shared/services/notification.service';

interface PageSettings {
  FlexLeft: number;
  FlexRight: number;
  ButtonIcon: string;
  DivClassRight: string;
  DivExpandedRight: boolean;
  TitleRight: string;
  ToolTipToggleButton: string;
}

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {
  requestDetails: RequestDetails;
  showSpinner = true;
  pageSettings = this.getPageSettings(false);
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

  toggleLogs(isExpanded: boolean) {
    if (isExpanded) {
      // Now Collapse
      this.pageSettings = this.getPageSettings(false);
    } else {
      // Now Expand
      this.pageSettings = this.getPageSettings(true);
    }
  }

  private getPageSettings(isExpadedVersion: boolean): PageSettings {
    if (isExpadedVersion) {
      return {
        FlexLeft: 50,
        FlexRight: 50,
        ButtonIcon: 'arrow_right',
        DivClassRight: '',
        DivExpandedRight: true,
        TitleRight: ' RESPONSE LOG',
        ToolTipToggleButton: 'Click to Collapse'
      } as PageSettings;
    } else {
      return {
        FlexLeft: 93,
        FlexRight: 7,
        ButtonIcon: 'arrow_left',
        DivClassRight: '',
        DivExpandedRight: false,
        TitleRight: '',
        ToolTipToggleButton: 'Click to Expand'
      } as PageSettings;
    }
  }

  getContextIcon(label: string): string {
    let contextIcon = '';
    const labelToLower = label.toLowerCase();

    if (labelToLower.indexOf('email') >= 0) {
      contextIcon = 'email';
    } else if (labelToLower.toLowerCase().indexOf('phone') >= 0) {
      contextIcon = 'call';
    } else {
      contextIcon = 'contacts';
    }
    return contextIcon;
  }

  getMatChipStyle(shortenStatus: any) {
    let matChipScss: {
      width: string;
      color: string;
      'background-color': string;
      border?: string;
    };

    switch (shortenStatus) {
      case 'PND': {
        matChipScss = {
          width: '170px',
          color: 'black',
          'background-color': 'rgba(128, 128, 128, 0.6)' // gray tint
        };
        break;
      }

      case 'INV': {
        matChipScss = {
          width: '170px',
          color: 'white',
          'background-color': 'rgba(255, 0, 0, 0.6)' // Red tint
        };
        break;
      }

      case 'NA': {
        matChipScss = {
          width: '170px',
          color: 'black',
          'background-color': 'rgba(211, 211, 211, 0.6)' // light gray
        };
        break;
      }

      case 'ERR': {
        matChipScss = {
          width: '170px',
          color: 'black',
          'background-color': 'rgba(255, 255, 0, 0.6)', // yellow
          border: '1px solid yellow'
        };
        break;
      }

      case 'NL': {
        matChipScss = {
          width: '170px',
          color: 'black',
          'background-color': 'rgb(253, 254, 254)', // white
          border: '1px solid #ebedef'
        };
        break;
      }

      default: {
        matChipScss = {
          width: '170px',
          color: 'black',
          'background-color': 'rgb(242, 242, 242)' // light gray
        };
        break;
      }
    }

    return matChipScss;
  }
}
