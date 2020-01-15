import {
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  Output,
  OnInit
} from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';

import { MatFileUploadQueue } from '../matFileUploadQueue/matFileUploadQueue.component';
import { environment } from './../../../../../environments/environment';

import { LookupStaticDataService } from './../../../services/lookup-static-data.service';
import { UserService } from './../../../../core/services/user.service';

/**
 * A material design file upload component.
 */
@Component({
  selector: 'mat-file-upload',
  templateUrl: `./matFileUpload.component.html`,
  exportAs: 'matFileUpload',
  host: {
    class: 'mat-file-upload'
  },
  styleUrls: ['./../matFileUploadQueue.scss']
})
export class MatFileUpload implements OnDestroy, OnInit {
  fileUploadFormGroup: FormGroup;

  // TODO -- we can clean the following
  public isUploading: boolean = false;

  /* Http request input bindings */
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

  /** Output  */
  @Output() removeEvent = new EventEmitter<MatFileUpload>();
  @Output() onUpload = new EventEmitter();

  public progressPercentage: number = 0;
  public loaded: number = 0;
  public total: number = 0;
  private _file: any;
  private _id: number;
  private fileUploadSubscription: any;
  private fileUploadUrl: any;
  invalidFileSizeMsg: string;
  invalidFileTypeMsg: string;

  @Input()
  get file(): any {
    return this._file;
  }
  set file(file: any) {
    this._file = file;
    this.total = this._file.size;
  }

  @Input()
  set id(id: number) {
    this._id = id;
  }
  get id(): number {
    return this._id;
  }

  get FileUploadUrl(): any {
    return this.fileUploadUrl;
  }
  set FileUploadUrl(fileUploadUrl: any) {
    this.fileUploadUrl = fileUploadUrl;
  }

  constructor(
    private HttpClient: HttpClient,
    @Inject(forwardRef(() => MatFileUploadQueue))
    public matFileUploadQueue: MatFileUploadQueue,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public lookupStaticDataService: LookupStaticDataService
  ) {
    if (matFileUploadQueue) {
      this.httpRequestHeaders =
        matFileUploadQueue.httpRequestHeaders || this.httpRequestHeaders;
      this.httpRequestParams =
        matFileUploadQueue.httpRequestParams || this.httpRequestParams;
      this.fileAlias = matFileUploadQueue.fileAlias || this.fileAlias;
    }
  }

  ngOnInit() {
    this.fileUploadFormGroup = this.formBuilder.group({
      isNotUSPerson: new FormControl(false),
      modalityControl: new FormControl('', [Validators.required])
    });
  }

  public upload(): void {
    this.isUploading = true;
    // How to set the alias?
    let formData = new FormData();
    formData.set(this.fileAlias, this._file, this._file.name);
    this.fileUploadSubscription = this.HttpClient.post(
      this.fileUploadUrl,
      formData,
      {
        headers: this.httpRequestHeaders,
        observe: 'events',
        params: this.httpRequestParams,
        reportProgress: true,
        responseType: 'json'
      }
    ).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressPercentage = Math.floor(
            (event.loaded * 100) / event.total
          );
          this.loaded = event.loaded;
          this.total = event.total;
        }
        this.onUpload.emit({ file: this._file, event: event });
      },
      (error: any) => {
        if (this.fileUploadSubscription) {
          this.fileUploadSubscription.unsubscribe();
        }
        this.isUploading = false;
        this.onUpload.emit({ file: this._file, event: event });
      }
    );
  }

  IsFileValidSize(): boolean {
    // file.size is in bytes
    if (this.file.size > environment.MaxFileSizeForPackage * 1048576) {
      this.invalidFileSizeMsg = 'Invalid file size';
      return false;
    } else {
      this.invalidFileSizeMsg = '';
      return true;
    }
  }

  IsFileValidType(): boolean {
    const result = this.lookupStaticDataService.allowedFileTypes.filter(
      fileType => fileType === this.file.type
    );
    if (result.length === 0) {
      this.invalidFileTypeMsg = 'Invalid file type';
      return false;
    } else {
      this.invalidFileTypeMsg = '';
      return true;
    }
  }

  public IsFormValid(): boolean {
    return (
      this.IsFileValidSize() &&
      this.IsFileValidType() &&
      this.fileUploadFormGroup.controls.modalityControl.valid
    );
  }

  public remove(): void {
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
    }
    this.removeEvent.emit(this);
  }

  ngOnDestroy() {
    console.log('file ' + this._file.name + ' destroyed...');
  }
}
