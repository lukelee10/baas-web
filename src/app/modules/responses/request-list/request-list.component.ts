import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RequestStatusFlags } from 'src/app/core/app-global-constants';
import { VettingStatusShortenPipe } from 'src/app/core/pipes/vetting-status-shorten.pipe';
import {
  AppMessage,
  AppMessagesService
} from 'src/app/core/services/app-messages.services';
import { PackageRequestService } from 'src/app/core/services/package-request.service';
import { Request } from 'src/app/shared/models/package-requests';
import { UserPackage } from 'src/app/shared/models/user-package';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { RequestDetailsComponent } from '../request-details/request-details.component';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit, OnChanges {
  showSpinner = true;
  deatilsPopup: MatDialogRef<RequestDetailsComponent, any>;

  packageRequests = new Array<Request>();
  packageRequestRaw = new Array<Request>();

  @Input()
  packageObj: UserPackage;

  constructor(
    private packageRequestService: PackageRequestService,
    private notificationService: NotificationService,
    private appMessagesService: AppMessagesService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.packageObj = {
      PackageId: '',
      Created: undefined,
      Name: ' Loading...',
      RequestCount: undefined
    };
  }

  ngOnChanges(changes: any) {
    const selectedPackage: UserPackage = changes.packageObj
      .currentValue as UserPackage;
    if (selectedPackage !== undefined) {
      this.getRequests(selectedPackage.PackageId);
    }
  }

  getRequests(packageId: string) {
    this.showSpinner = true;
    //  this.packageRequestService.isMock = true;
    this.packageRequestService.packageId = packageId;
    this.notificationService.debugLogging(
      this.packageRequestService.getEndPointURL()
    );
    this.packageRequestService.getPackageRequests().subscribe(
      packageRequestResponse => {
        this.packageRequestRaw = packageRequestResponse.requests;
        this.packageRequests = this.getRequestsProcessedData();
        this.notificationService.debugLogging(this.packageRequests);
      },
      error => {
        this.notificationService.error(
          this.appMessagesService.getMessage(
            AppMessage.ViewReponseRequestsAPIError
          ),
          this.appMessagesService.getTitle(
            AppMessage.ViewReponseRequestsAPIError
          )
        );
        this.showSpinner = false;
        this.notificationService.debugLogging(error);
      },
      () => {
        this.showSpinner = false;
      }
    );
  }

  private getRequestsProcessedData(): Array<Request> {
    const pkgRequests = new Array<Request>();
    this.packageRequestRaw.forEach(pkgRquest => {
      const status = new VettingStatusShortenPipe().transform(pkgRquest.Status);
      switch (status) {
        case RequestStatusFlags.InvestigativeLead:
          pkgRquest.StatusPrecedence = 1;
          break;
        case RequestStatusFlags.Error:
          pkgRquest.StatusPrecedence = 2;
          break;
        case RequestStatusFlags.Pending:
          pkgRquest.StatusPrecedence = 3;
          break;
        case RequestStatusFlags.NoLead:
          pkgRquest.StatusPrecedence = 4;
          break;
        default:
          pkgRquest.StatusPrecedence = 2;
      }
      pkgRequests.push(pkgRquest);
    });

    const pkgRequestsSorted = pkgRequests.sort((n1: Request, n2: Request) => {
      if (n1.StatusPrecedence > n2.StatusPrecedence) {
        return 1;
      }

      if (n1.StatusPrecedence < n2.StatusPrecedence) {
        return -1;
      }

      return 0;
    });

    return pkgRequestsSorted;
  }

  openDialog(request: Request): void {
    this.deatilsPopup = this.dialog.open(RequestDetailsComponent, {
      width: '800px',
      height: '700px',
      data: request
    });
  }

  // TODO   This needs to be refactored to avoid hard-coding the vetting systems at the HTML template
  vettingSystemShow(status: string): boolean {
    return !(
      RequestStatusFlags.EmptyString ===
      new VettingStatusShortenPipe().transform(status)
    );
  }
}
