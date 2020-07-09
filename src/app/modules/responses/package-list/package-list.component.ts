import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { UserPackageService } from 'src/app/core/services/user-package.service';
import { UserPackage } from 'src/app/shared/models/user-package';
import { NotificationService } from 'src/app/shared/services/notification.service';

import {
  AppMessage,
  AppMessagesService
} from '../../../core/services/app-messages.service';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit, OnChanges {
  userPackages = new Array<UserPackage>();
  showSpinner = false;
  currentLastItem = '';
  initLoad = false;
  @Input()
  sortOrder = 'desc';
  @Output() eventOnPackageClick = new EventEmitter();
  @Output() eventFirstPackage: EventEmitter<UserPackage> = new EventEmitter();

  constructor(
    private userPackageService: UserPackageService,
    private notificationService: NotificationService,
    private appMessagesService: AppMessagesService
  ) {}

  ngOnChanges(changes: any) {
    const sortOldVal = changes.sortOrder.previousValue;
    const sortNewVal = changes.sortOrder.currentValue;

    if (sortOldVal !== sortNewVal && sortOldVal !== undefined) {
      this.userPackages = [];
      this.invokePackageService();
    }
  }
  ngOnInit() {
    if (!this.initLoad) {
      this.invokePackageService();
      this.initLoad = true;
    }
  }

  packageClick(pacakageObj: UserPackage) {
    this.eventOnPackageClick.emit(pacakageObj);
  }

  private invokePackageService() {
    this.showSpinner = true;
    this.userPackageService.sortOrder = this.sortOrder;
    this.userPackageService.startingItem = this.currentLastItem;
    this.userPackageService.pageSize = 50;
    this.notificationService.debugLogging(
      this.userPackageService.getEndPointURL()
    );
    this.userPackageService.getPackages().subscribe(
      userPackageResponse => {
        this.userPackages = userPackageResponse.packages;
        this.currentLastItem = userPackageResponse.lastItem;
        this.notificationService.debugLogging(userPackageResponse);
        this.notificationService.debugLogging(
          'User Package Respose Last Item: ' + userPackageResponse.lastItem
        );
        this.notificationService.debugLogging(
          'User Package Response Total Package Count:' +
            userPackageResponse.count.toString()
        );
      },
      error => {
        this.notificationService.error(
          this.appMessagesService.getMessage(AppMessage.ViewResponseAPIError),
          this.appMessagesService.getTitle(AppMessage.ViewResponseAPIError)
        );
        this.showSpinner = false;
        this.notificationService.debugLogging(error);
      },
      () => {
        this.showSpinner = false;
        if (this.userPackages.length > 0) {
          const firstPackage: UserPackage = this.userPackages[0];
          this.eventFirstPackage.emit(firstPackage);
        }
      }
    );
  }
}
