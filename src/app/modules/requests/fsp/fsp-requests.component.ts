import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { concatMap, finalize } from 'rxjs/operators';
import { from } from 'rxjs';

import { Guid } from 'guid-typescript';
import * as moment_ from 'moment';
const moment = moment_;

// tslint:disable-next-line: max-line-length
import { MatFileUploadQueueComponent } from './../../../shared/components/multi-file-upload/matFileUploadQueue/matFileUploadQueue.component';
import { environment } from './../../../../environments/environment';

import { AwsLambdaService } from './../../../core/services/aws-lambda.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { UserService } from './../../../core/services/user.service';

import { RequestModel } from './../../models/request-model';

@Component({
  selector: 'app-fsp-requests',
  templateUrl: './fsp-requests.component.html'
})
export class FspRequestsComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatFileUploadQueueComponent, { static: false })
  private matFileUploadQueueComponent: MatFileUploadQueueComponent;
  filesValidationError: boolean;
  allowwedFileSize = `File cannot be more than ${environment.MaxFileSizeForPackage} MB size`;
  filesValidationMessage: string;
  requests: Array<RequestModel> = [];
  savedRequestIds: string[] = [];

  form = new FormGroup({
    packageTitle: new FormControl('', Validators.required)
  });

  @Input() httpRequestHeaders:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      } = new HttpHeaders()
    .set('sampleHeader', 'headerValue')
    .set('sampleHeader1', 'headerValue1');

  @Input()
  httpRequestParams:
    | HttpParams
    | {
        [param: string]: string | string[];
      } = new HttpParams()
    .set('sampleRequestParam', 'requestValue')
    .set('sampleRequestParam1', 'requestValue1');

  constructor(
    private changeDetector: ChangeDetectorRef,
    private userService: UserService,
    private awsLambdaService: AwsLambdaService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filesValidationError = true;
    this.filesValidationMessage = 'At least one file needs to be selected';
  }

  ngOnInit() {}

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  UploadFilesListChanged(files: any) {
    this.filesValidationError = true;
    this.filesValidationMessage = 'At least one file needs to be selected';

    const numberOfFiles = files.toArray().length;

    if (numberOfFiles > environment.MaxFileCountForPackage) {
      this.filesValidationError = true;
      this.filesValidationMessage = `Selected ${numberOfFiles} files, 
        Not more than ${environment.MaxFileCountForPackage} files to create a Package`;
    } else if (
      numberOfFiles &&
      numberOfFiles <= environment.MaxFileCountForPackage
    ) {
      this.filesValidationError = false;
      this.filesValidationMessage = `Number of Files in Package: ${numberOfFiles}`;
    }
  }

  IsFileUploadFormValid(): boolean {
    if (this.matFileUploadQueueComponent.files.length === 0) {
      return false;
    }

    if (
      this.matFileUploadQueueComponent.files.length >
      environment.MaxFileCountForPackage
    ) {
      return false;
    }

    for (const item of this.matFileUploadQueueComponent
      .getQueueData()
      .toArray()) {
      if (!item.IsFormValid()) {
        return false;
      }
    }

    return true;
  }

  onSubmitRequest() {
    this.prepareThePackage();

    this.submitThePackage();
  }

  prepareThePackage() {
    this.requests.splice(0, this.requests.length);
    const queueData = this.matFileUploadQueueComponent.getQueueData().toArray();

    const packageId = Guid.create().toString();
    const packageName = this.form.value.packageTitle;
    const username = this.userService.UserId;
    const group = this.userService.Group;

    const hasMultipleFiles = queueData.length > 1;

    queueData.forEach(item => {
      const itemData = item.GetPackageFileModel();

      const newRequest: RequestModel = {
        id: Guid.create().toString(),
        name: hasMultipleFiles
          ? `${packageName} : ${itemData.FileName}`
          : packageName,
        username,
        group,
        packageId,
        mimeType: itemData.FileType,
        fileSize: itemData.FileSize,
        originalFileName: itemData.FileName,
        modality: itemData.Modality,
        created: moment.utc().format('YYYY-MM-DDTHH:mm:ss')
      };
      this.requests.push(newRequest);
    });
  }

  submitThePackage() {
    this.loaderService.Show('Submitting package...');
    this.savedRequestIds.splice(0, this.savedRequestIds.length);

    let showNotification: boolean;
    showNotification = false;

    // Details on 'concatMap' RxJS operator
    // One of the strategies to handle until the first completes before subscribing to the next one.
    // For more info on RxJS, please browse https://www.learnrxjs.io/learn-rxjs/operators/transformation/concatmap
    // and https://rxjs-dev.firebaseapp.com/api/operators/concatMap
    from(this.requests)
      .pipe(
        concatMap(param => this.awsLambdaService.createRequestPackage(param)),

        finalize(() => {
          this.loaderService.Hide();
          if (showNotification) {
            this.resetTheForm();
            this.notificationService.notify(
              'BaaS - Created package successfully !!!'
            );
          }
        })
      )
      .subscribe(
        data => {
          const copyResponse = JSON.parse(JSON.stringify(data));
          // TODO we need uploadUrl, to upload the file to S3
          const uploadUrl = copyResponse.uploadUrl;
          const savedRequest = this.requests.shift();
          showNotification = true;
          this.savedRequestIds.push(savedRequest.id);
        },
        error => {
          showNotification = false;
          this.handlePackageSubmissionError();
        }
      );
  }

  handlePackageSubmissionError() {
    this.loaderService.Show(
      'Package submission failed, rolling back the changes...'
    );

    this.savedRequestIds.forEach(requestId => {
      this.awsLambdaService.deleteRequestPackage(requestId).subscribe(
        result => {
          this.loaderService.Hide();
        },
        error => {
          this.loaderService.Hide();
        }
      );
    });
  }

  private resetTheForm() {
    this.form.reset();
    if (this.matFileUploadQueueComponent) {
      this.matFileUploadQueueComponent.removeAll();
    }
  }
}
