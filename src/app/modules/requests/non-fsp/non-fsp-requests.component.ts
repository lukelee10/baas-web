import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { concatMap, finalize } from 'rxjs/operators';
import { from } from 'rxjs';

import { Guid } from 'guid-typescript';
import * as moment_ from 'moment';
const moment = moment_;

import { environment } from './../../../../environments/environment';
// tslint:disable-next-line: max-line-length
import { MatFileUploadQueueComponent } from './../../../shared/components/multi-file-upload/matFileUploadQueue/matFileUploadQueue.component';
import { LookupStaticDataService } from './../../../shared/services/lookup-static-data.service';

import { AwsLambdaService } from './../../../core/services/aws-lambda.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { UserService } from './../../../core/services/user.service';

import { RequestModel } from './../../models/request-model';

@Component({
  selector: 'app-non-fsp-requests',
  templateUrl: './non-fsp-requests.component.html',
  styleUrls: ['./non-fsp-requests.component.scss']
})
export class NonFspRequestsComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatFileUploadQueueComponent, { static: false })
  private matFileUploadQueueComponent: MatFileUploadQueueComponent;
  filesValidationError: boolean;
  allowwedFileSize = `File cannot be more than ${environment.MaxFileSizeForPackage} MB size`;
  vettingSystems: string[] = [];
  requests: Array<RequestModel> = [];
  savedRequestIds: string[] = [];

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

  form = new FormGroup({
    packageTitle: new FormControl('', Validators.required),
    selectClassification: new FormControl('', Validators.required),
    filesClassification: new FormControl('', Validators.required)
  });

  filesValidationMessage: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    public lookupStaticDataService: LookupStaticDataService,
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
    const test = environment.MaxFileCountForPackage;

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

  ProvidersSelectionChanged(providers: any) {
    this.vettingSystems.splice(0, this.vettingSystems.length);

    providers.forEach(provider => {
      this.vettingSystems.push(provider.ProviderId);
    });
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
    const titleClassification = this.form.value.selectClassification;
    const packageClassification = this.form.value.filesClassification;
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
        titleClassification,
        systems: this.vettingSystems,
        username,
        group,
        packageId,
        packageClassification,
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
