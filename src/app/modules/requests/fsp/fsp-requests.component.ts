import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders, HttpParams } from '@angular/common/http';

// tslint:disable-next-line: max-line-length
import { MatFileUploadQueueComponent } from './../../../shared/components/multi-file-upload/matFileUploadQueue/matFileUploadQueue.component';
import { environment } from './../../../../environments/environment';

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

  constructor(private changeDetector: ChangeDetectorRef) {
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
}
