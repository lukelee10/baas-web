import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './../../../../environments/environment';

import { MatFileUploadQueue } from './../../../shared/components/multi-file-upload/matFileUploadQueue/matFileUploadQueue.component';

import { LookupStaticDataService } from './../../../shared/services/lookup-static-data.service';

import { requireCheckboxesToBeCheckedValidator } from '../../../shared/require-checkboxes-to-be-checked.validator';

@Component({
  selector: 'app-non-fsp-requests',
  templateUrl: './non-fsp-requests.component.html',
  styleUrls: ['./non-fsp-requests.component.scss']
})
export class NonFspRequestsComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatFileUploadQueue, { static: false })
  private matFileUploadQueueComponent: MatFileUploadQueue;
  filesValidationError: boolean;
  allowwedFileSize = `File cannot be more than ${environment.MaxFileSizeForPackage} MB size`;

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
    filesClassification: new FormControl('', Validators.required),
    vettingCheckBoxGroup: new FormGroup(
      {
        vettingLowBall: new FormControl(false),
        vetting3LA: new FormControl(false),
        vettingABIS: new FormControl(false),
        vettingHIGHTOP: new FormControl(false)
      },
      requireCheckboxesToBeCheckedValidator()
    )
  });

  filesValidationMessage: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    public lookupStaticDataService: LookupStaticDataService
  ) {
    this.filesValidationError = true;
    this.filesValidationMessage = 'At least one file needs to be selected';
  }

  ngOnInit() {
    // this.form.get('packageTitle').setValue('');
    //  console.log('packageTitle: ' + this.form.get('packageTitle').value);
  }

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
