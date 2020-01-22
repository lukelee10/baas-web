import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';
import { merge, Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { MatFileUploadComponent } from './../matFileUpload/matFileUpload.component';

/**
 * A material design file upload queue component.
 */
@Component({
  selector: 'app-mat-file-upload-queue',
  templateUrl: `matFileUploadQueue.component.html`,
  exportAs: 'matFileUploadQueue'
})
export class MatFileUploadQueueComponent implements OnDestroy, AfterViewInit {
  @ContentChildren(forwardRef(() => MatFileUploadComponent))
  fileUploads: QueryList<MatFileUploadComponent>;

  /** Subscription to remove changes in files. */
  private fileRemoveSubscription: Subscription | null;

  /** Subscription to changes in the files. */
  private changeSubscription: Subscription;

  /** Combined stream of all of the file upload remove change events. */
  get fileUploadRemoveEvents(): Observable<MatFileUploadComponent> {
    return merge(...this.fileUploads.map(fileUpload => fileUpload.removeEvent));
  }

  @Output() eventOnUploadFilesListChanged = new EventEmitter();

  public files: Array<any> = [];

  /* Http request input bindings */
  @Input()
  httpUrl: string;

  @Input()
  httpRequestHeaders:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      } = new HttpHeaders();

  @Input()
  httpRequestParams:
    | HttpParams
    | {
        [param: string]: string | string[];
      } = new HttpParams();

  @Input()
  fileAlias = 'file';

  public ngAfterViewInit() {
    // When the list changes, re-subscribe
    this.changeSubscription = this.fileUploads.changes
      .pipe(startWith(null))
      .subscribe(() => {
        if (this.fileRemoveSubscription) {
          this.fileRemoveSubscription.unsubscribe();
        }
        this.eventOnUploadFilesListChanged.emit(this.fileUploads);
        this._listenTofileRemoved();
      });
  }

  private _listenTofileRemoved(): void {
    this.fileRemoveSubscription = this.fileUploadRemoveEvents.subscribe(
      (event: MatFileUploadComponent) => {
        this.files.splice(event.Id, 1);
      }
    );
  }

  add(file: any) {
    this.files.push(file);
  }

  public uploadAll() {
    this.fileUploads.forEach(fileUpload => {
      fileUpload.upload();
    });
  }

  public removeAll() {
    this.files.splice(0, this.files.length);
  }

  getQueueData(): QueryList<MatFileUploadComponent> {
    return this.fileUploads;
  }

  ngOnDestroy() {
    if (this.files) {
      this.removeAll();
    }
  }
}
