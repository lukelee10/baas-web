import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment_ from 'moment';
import { from } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { MatFileUploadQueueComponent } from 'src/app/shared/components/multi-file-upload/matFileUpload';

import { environment } from './../../../../environments/environment';
import { AwsLambdaService } from './../../../core/services/aws-lambda.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { NotificationService } from './../../../shared/services/notification.service';
import {
  RequestModel,
  PackageModel,
  SavedPackageModel,
  SavedRequestModel
} from './../../models/request-model';

const moment = moment_;

@Component({
  selector: 'app-fsp-requests',
  templateUrl: './fsp-requests.component.html'
})
export class FspRequestsComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatFileUploadQueueComponent, { static: false })
  private matFileUploadQueueComponent: MatFileUploadQueueComponent;
  filesValidationError: boolean;
  allowedFileSize = `File cannot be more than ${environment.MaxFileSizeForPackage} MB size`;
  filesValidationMessage: string;
  packageToSubmit: PackageModel;
  savedRequestIds: string[] = [];

  form = new FormGroup({
    packageTitle: new FormControl('', Validators.required)
  });

  constructor(
    private changeDetector: ChangeDetectorRef,
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

  isDirty() {
    return this.form.dirty || this.matFileUploadQueueComponent.files.length > 0;
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
    this.packageToSubmit = {
      packageName: this.form.value.packageTitle,
      requests: []
    };

    const queueData = this.matFileUploadQueueComponent.getQueueData().toArray();
    queueData.forEach(item => {
      const itemData = item.GetPackageFileModel();

      const newRequest: RequestModel = {
        name: itemData.FileName,
        mimeType: itemData.FileType
          ? itemData.FileType
          : itemData.BinaryMimetype,
        fileSize: itemData.FileSize,
        modality: itemData.Modality,
        clientSideAssociationId: item.Id
      };
      this.packageToSubmit.requests.push(newRequest);
    });
  }

  submitThePackage() {
    let submitThePackageFailed = false;
    this.savedRequestIds.length = 0;
    this.loaderService.Show('Submitting package...');

    this.awsLambdaService
      .createRequestPackage(this.packageToSubmit)
      .pipe(
        finalize(() => {
          if (!submitThePackageFailed) {
            this.uploadFilesToS3();
          } else {
            this.loaderService.Hide();
          }
        })
      )
      .subscribe(
        data => {
          const copyResponse: SavedPackageModel = JSON.parse(
            JSON.stringify(data)
          );
          const aAllReqs: SavedRequestModel[] = copyResponse.Requests;
          this.savedRequestIds.push(...aAllReqs.map(req => req.RequestId));

          // Update the corresponding File Upload component to include UploadURL
          const queueData = this.matFileUploadQueueComponent
            .getQueueData()
            .toArray();

          // Sanity checking with a debug log
          this.notificationService.debugLogging(
            'QueueData.length: %d; Package.Requests.length: %d',
            queueData.length,
            aAllReqs.length
          );
          queueData.map((fileUpComponent, idx) => {
            fileUpComponent.FileUploadUrl = aAllReqs[idx].UploadUrl;
          });
        },
        error => {
          this.notificationService.error('Submitting package is failed.');
          submitThePackageFailed = true;
          this.handlePackageSubmissionError();
        }
      );
  }

  uploadFilesToS3() {
    let showNotification = false;
    this.loaderService.Show('Uploading files to S3...');

    const queueData = this.matFileUploadQueueComponent.getQueueData().toArray();

    // ConcatMap
    // One of the strategies to handle until the first completes before subscribing to the next one.
    // For more info on RxJS, please browse https://www.learnrxjs.io/learn-rxjs/operators/transformation/concatmap
    // and https://rxjs-dev.firebaseapp.com/api/operators/concatMap
    from(queueData)
      .pipe(
        concatMap(param => param.upload()),

        finalize(() => {
          this.loaderService.Hide();

          if (showNotification) {
            this.resetTheForm();
            this.notificationService.notify('Package has been submitted');
          }
        })
      )
      .subscribe(
        result => {
          showNotification = true;
        },
        error => {
          // some error happened
          showNotification = false;
          this.notificationService.error('Uploading Request image failed');
          this.handlePackageSubmissionError();
        }
      );
  }

  handlePackageSubmissionError() {
    this.loaderService.Show(
      'Package submission failed, rolling back the changes...'
    );

    // ConcatMap
    // One of the strategies to handle until the first completes before subscribing to the next one.
    // For more info on RxJS, please browse https://www.learnrxjs.io/learn-rxjs/operators/transformation/concatmap
    // and https://rxjs-dev.firebaseapp.com/api/operators/concatMap
    from(this.savedRequestIds)
      .pipe(
        concatMap(requestId =>
          this.awsLambdaService.deleteRequestPackage(requestId)
        ),

        finalize(() => {
          this.loaderService.Hide();
        })
      )
      .subscribe(
        result => {},
        error => {
          this.notificationService.error('Failed while rolling back changes.');
        }
      );
  }

  private resetTheForm() {
    this.form.reset();
    if (this.matFileUploadQueueComponent) {
      this.matFileUploadQueueComponent.removeAll();
    }
  }
}
