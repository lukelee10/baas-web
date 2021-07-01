import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';

import { environment } from './../../../../../environments/environment';
import { UserService } from './../../../../core/services/user.service';
import { PackageFileModel } from './../../../../modules/models/package-file-model';
import { LookupStaticDataService } from './../../../services/lookup-static-data.service';
import { MatFileUploadQueueComponent } from './../matFileUploadQueue/matFileUploadQueue.component';

@Component({
  selector: 'app-mat-file-upload',
  templateUrl: './matFileUpload.component.html',
  exportAs: 'MatFileUploadComponent',
  styleUrls: ['./../matFileUploadQueue.scss']
})
export class MatFileUploadComponent implements OnInit {
  fileUploadFormGroup: FormGroup;

  /** Output  */
  @Output() removeEvent = new EventEmitter<MatFileUploadComponent>();
  @Output() handleUpload = new EventEmitter();

  private file: any;
  private id: number;
  private fileUploadUrl: any;
  private applyAllModality: string;
  private applyAllClassification: string;

  invalidFileSizeMsg: string;
  invalidFileTypeMsg: string;

  @Input()
  get File(): any {
    return this.file;
  }
  set File(file: any) {
    this.file = file;
  }

  @Input()
  set Id(id: number) {
    this.id = id;
  }
  get Id(): number {
    return this.id;
  }

  set FileUploadUrl(fileUploadUrl: any) {
    this.fileUploadUrl = fileUploadUrl;
  }

  @Input()
  set ApplyAllModality(applyAllModalityStr: string) {
    this.fileUploadFormGroup.controls.modality.setValue(applyAllModalityStr);
    this.applyAllModality = applyAllModalityStr;
  }
  @Input()
  set ApplyAllClassification(applyAllClassificationStr: string) {
    this.fileUploadFormGroup.controls.imageClassification.setValue(
      applyAllClassificationStr
    );
    this.applyAllClassification = applyAllClassificationStr;
  }

  constructor(
    private httpClient: HttpClient,
    @Inject(forwardRef(() => MatFileUploadQueueComponent))
    public matFileUploadQueue: MatFileUploadQueueComponent,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public lookupStaticDataService: LookupStaticDataService
  ) {}

  ngOnInit() {
    this.fileUploadFormGroup = this.formBuilder.group({
      isNotUSPerson: new FormControl(false),
      modality: new FormControl('', [Validators.required]),
      imageClassification: new FormControl('U')
    });
  }

  public upload(): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', this.file.type);
    headers.set('X-XSS-Protection', '1; mode=block');

    const options = {
      headers,
      reportProgress: true
    };

    return this.httpClient.put(this.fileUploadUrl, this.file, options);
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
    const resultFileType = this.lookupStaticDataService.allowedFileTypes.filter(
      fileType => fileType === this.file.type
    );

    const resultBinaryFileType = this.lookupStaticDataService.allowedFileTypes.filter(
      fileType => fileType === this.file.binaryMimetype
    );

    if (resultFileType.length === 0 && resultBinaryFileType.length === 0) {
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
      this.fileUploadFormGroup.controls.modality.valid
    );
  }

  public GetPackageFileModel(): PackageFileModel {
    const packageFileModel: PackageFileModel = {
      ID: this.id,
      FileName: this.file.name,
      FileType: this.file.type,
      BinaryMimetype: this.file.binaryMimetype,
      FileSize: this.file.size,
      IsNotUSPerson: this.fileUploadFormGroup.value.isNotUSPerson,
      Modality: this.fileUploadFormGroup.value.modality,
      ImageClassification: this.fileUploadFormGroup.value.imageClassification
    };

    return packageFileModel;
  }

  public remove(): void {
    this.removeEvent.emit(this);
  }

  public clearValidators() {
    this.fileUploadFormGroup.controls.modality.clearValidators();
    this.fileUploadFormGroup.controls.modality.updateValueAndValidity();
  }
}
