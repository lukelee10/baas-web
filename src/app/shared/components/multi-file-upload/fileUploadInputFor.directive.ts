import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';

/**
 * A material design file upload queue component.
 */
@Directive({
  // the linting assumed all agnular directives are on custom component.
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
      this.preview(file);
      this.queue.add(file);
    }

    event.preventDefault();
    event.stopPropagation();
    this.element.nativeElement.value = '';
  }

  preview(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      Object.assign(file, {
        preview: reader.result
      });
    };
  }

  @HostListener('dragover', ['$event'])
  public onDropOver(event: any): any {
    event.preventDefault();
  }
}
