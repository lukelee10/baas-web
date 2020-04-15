import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';

import {
  AppGlobalConstants,
  FileMimeType,
  FileMagicNumber
} from '../../../../../src/app/core/app-global-constants';

/**
 * A material design file upload queue component.
 */
@Directive({
  // the linting assumed all angular directives are on custom component.
  // This directive, however, is a add onto the native <input> and <div>
  // tags in HTML The selector should be prefixed by "app"
  // (https://angular.io/guide/styleguide#style-02-08) (directive-selector)
  // tslint:disable-next-line: directive-selector
  selector: 'input[fileUploadInputFor], div[fileUploadInputFor]'
})
export class FileUploadInputForDirective {
  private queue: any = null;
  private htmlElement: HTMLElement;

  @Output() public FileSelected: EventEmitter<File[]> = new EventEmitter<
    File[]
  >();

  constructor(private element: ElementRef) {
    this.htmlElement = this.element.nativeElement;
  }

  @Input('fileUploadInputFor')
  set fileUploadQueue(value: any) {
    if (value) {
      this.queue = value;
    }
  }

  @HostListener('change')
  public onChange(): any {
    const files = this.element.nativeElement.files;
    this.FileSelected.emit(files);

    if (!files) {
      return;
    }

    for (const file of files) {
      this.discernMimeType(file);
      this.preview(file);
      this.queue.add(file);
    }

    this.element.nativeElement.value = '';
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any): any {
    const files = event.dataTransfer.files;
    this.FileSelected.emit(files);

    if (!files) {
      return;
    }

    for (const file of files) {
      this.discernMimeType(file);
      this.preview(file);
      this.queue.add(file);
    }

    event.preventDefault();
    event.stopPropagation();
    this.element.nativeElement.value = '';
  }

  preview(file: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      Object.assign(file, {
        preview: reader.result
      });
    };
  }

  /**
   * Discern the MIME Type of a given File object.
   */
  discernMimeType(file: Blob): string {
    // Check if the MIME Type is defined and is something other than pure-binary.
    // For reference, "application/octet-stream" is the de facto standard MIME
    //   Type reported by most applications when they do not recognize the MIME
    //   Type of a provided file/data object.
    if (
      file.type &&
      file.type.toLowerCase() !== AppGlobalConstants.GenericUnknownMimeType
    ) {
      return file.type;
    }

    this.readFileForBinaryMagicNumber(file);
  }

  /**
   * Reads file for binary magic number
   */
  readFileForBinaryMagicNumber(file: Blob) {
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = event => {
      const arrayBuffer = this.convertStringToArrayBuffer(fileReader.result);
      let header = '';

      for (const element of arrayBuffer) {
        header += element.toString(16);
      }
      const fileMagicNumber = header.toUpperCase();
      const mimeType = this.getMimeTypeofUnknownFile(fileMagicNumber);
      Object.assign(file, {
        binaryMimetype: mimeType
      });
    };

    // Slice the blob from 0 byte to 8 bytes, instead of reading the whole blob
    const blob = file.slice(0, 8);
    fileReader.readAsText(blob);
  }

  /**
   * Gets mime typeof unknown file
   */
  getMimeTypeofUnknownFile(fileMagicNumber: string) {
    let sMimeType: string;
    // Run through a list of content-sniffing/MIME Type detection functions until
    // one of them reports a match.
    const matcherFuncts = [
      {
        CheckerFunction: this.checkIsFileJP2000,
        MimeType: FileMimeType.JP2
      }
    ];

    const iMatchedSensorIndex = matcherFuncts.findIndex(fnMatchFunct =>
      fnMatchFunct.CheckerFunction(fileMagicNumber)
    );
    if (iMatchedSensorIndex < 0) {
      // No matches
      sMimeType = AppGlobalConstants.GenericUnknownMimeType;
    } else {
      sMimeType = matcherFuncts[iMatchedSensorIndex].MimeType;
    }
    return sMimeType;
  }

  /**
   * Converts string to array buffer
   */
  convertStringToArrayBuffer(str) {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
  }

  checkIsFileJP2000(fileMagicNumber: string): boolean {
    if (fileMagicNumber === FileMagicNumber.JP2) {
      return true;
    }

    return false;
  }

  @HostListener('dragover', ['$event'])
  public onDropOver(event: any): any {
    event.preventDefault();
  }
}
