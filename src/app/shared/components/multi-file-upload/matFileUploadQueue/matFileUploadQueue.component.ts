import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Component,
  ContentChildren,
  forwardRef,
  Input,
  OnDestroy,
  QueryList
} from '@angular/core';
import { merge, Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { MatFileUpload } from './../matFileUpload/matFileUpload.component';

/**
 * A material design file upload queue component.
 */
@Component({
  selector: 'mat-file-upload-queue',
  templateUrl: `matFileUploadQueue.component.html`,
  exportAs: 'matFileUploadQueue'
})
export class MatFileUploadQueue implements OnDestroy {
  @ContentChildren(forwardRef(() => MatFileUpload)) fileUploads: QueryList<
    MatFileUpload
  >;

  /** Subscription to remove changes in files. */
  private _fileRemoveSubscription: Subscription | null;

  /** Subscription to changes in the files. */
  private _changeSubscription: Subscription;

  /** Combined stream of all of the file upload remove change events. */
  get fileUploadRemoveEvents(): Observable<MatFileUpload> {
    return merge(...this.fileUploads.map(fileUpload => fileUpload.removeEvent));
  }

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
  fileAlias: string = 'file';

  ngAfterViewInit() {
    // When the list changes, re-subscribe
    this._changeSubscription = this.fileUploads.changes
      .pipe(startWith(null))
      .subscribe(() => {
        if (this._fileRemoveSubscription) {
          this._fileRemoveSubscription.unsubscribe();
        }
        this._listenTofileRemoved();
      });
  }

  private _listenTofileRemoved(): void {
    this._fileRemoveSubscription = this.fileUploadRemoveEvents.subscribe(
      (event: MatFileUpload) => {
        this.files.splice(event.id, 1);
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

  //This method needs to be updated so that it can be updated to S3
  public submitRequests() {
    this.fileUploads.forEach(fileUpload => {
      fileUpload.upload();
    });
  }

  ngOnDestroy() {
    if (this.files) {
      this.removeAll();
    }
  }
}
