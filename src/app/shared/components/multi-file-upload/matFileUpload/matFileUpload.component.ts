import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import {
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { environment } from './../../../../../environments/environment';
import { UserService } from './../../../../core/services/user.service';
import { LookupStaticDataService } from './../../../services/lookup-static-data.service';
import { MatFileUploadQueueComponent } from './../matFileUploadQueue/matFileUploadQueue.component';

@Component({
  selector: 'app-mat-file-upload',
  templateUrl: `./matFileUpload.component.html`,
  exportAs: 'MatFileUploadComponent',
  styleUrls: ['./../matFileUploadQueue.scss']
})
export class MatFileUploadComponent implements OnDestroy, OnInit {
  fileUploadFormGroup: FormGroup;

  // TODO -- we can clean the following
  public isUploading = false;

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
  fileAlias = 'file';

  /** Output  */
  @Output() removeEvent = new EventEmitter<MatFileUploadComponent>();
  @Output() handleUpload = new EventEmitter();

  public progressPercentage = 0;
  public loaded = 0;
  public total = 0;
  private file: any;
  private id: number;
  private fileUploadSubscription: any;
  private fileUploadUrl: any;
  invalidFileSizeMsg: string;
  invalidFileTypeMsg: string;

  @Input()
  get File(): any {
    return this.file;
  }
  set File(file: any) {
    this.file = file;
    this.total = this.file.size;
  }

  @Input()
  set Id(id: number) {
    this.id = id;
  }
  get Id(): number {
    return this.id;
  }

  get FileUploadUrl(): any {
    return this.fileUploadUrl;
  }
  set FileUploadUrl(fileUploadUrl: any) {
    this.fileUploadUrl = fileUploadUrl;
  }

  constructor(
    private httpClient: HttpClient,
    @Inject(forwardRef(() => MatFileUploadQueueComponent))
    public matFileUploadQueue: MatFileUploadQueueComponent,
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
    const formData = new FormData();
    formData.set(this.fileAlias, this.file, this.file.name);
    this.fileUploadSubscription = this.httpClient
      .post(this.fileUploadUrl, formData, {
        headers: this.httpRequestHeaders,
        observe: 'events',
        params: this.httpRequestParams,
        reportProgress: true,
        responseType: 'json'
      })
      .subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressPercentage = Math.floor(
              (event.loaded * 100) / event.total
            );
            this.loaded = event.loaded;
            this.total = event.total;
          }
          this.handleUpload.emit({ file: this.file, event });
        },
        (error: any) => {
          if (this.fileUploadSubscription) {
            this.fileUploadSubscription.unsubscribe();
          }
          this.isUploading = false;
          this.handleUpload.emit({ file: this.file, event });
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
    console.log('file ' + this.file.name + ' destroyed...');
  }
}
