import { Component } from '@angular/core';
import { FileUploadInputForDirective } from './fileUploadInputFor.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// Simple Dummy test component that will not in the actual app
// Easy to test just the directive
@Component({
  template:
    '<div [fileUploadInputFor]="fileUploadQueue"><input [fileUploadInputFor]="fileUploadQueue"/></div>'
})
class DummyTestComponent {
  constructor() {}
}

describe('FileUploadInputForDirective', () => {
  let component: DummyTestComponent;
  let fixture: ComponentFixture<DummyTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DummyTestComponent, FileUploadInputForDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyTestComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should return no files', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLInputElement = debugEl.querySelector('input');

    const fakeChangeEvent = new Event('change');
    input.dispatchEvent(fakeChangeEvent);

    fixture.whenStable().then(() => {
      console.log(JSON.stringify(input.files));
      expect(input.files).toBeNull();
    });
  });

  it('on change should return file preview when file is valid file type', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLInputElement = debugEl.querySelector('input');

    const dT = new ClipboardEvent('').clipboardData || new DataTransfer();
    dT.items.add(
      new File(['foo'], 'programmatically_created.png', {
        type: 'image/png',
        lastModified: Date.now()
      })
    );
    input.type = 'file';
    input.name = 'files';
    input.multiple = true;
    input.files = dT.files;

    const fakeChangeEvent = new Event('change');
    input.dispatchEvent(fakeChangeEvent);

    fixture.whenStable().then(() => {
      const testFile = input.files[0] as any;
      expect(testFile.preview).not.toBeNull();
      expect(testFile.binaryMimetype).toBeUndefined();
    });
  });

  it('should return no file preview when file is JP2 file type', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLInputElement = debugEl.querySelector('input');

    const dT = new ClipboardEvent('').clipboardData || new DataTransfer();
    dT.items.add(
      new File(['000C6A502020'], 'programmatically_created.jp2', {
        type: 'image/jp2',
        lastModified: Date.now()
      })
    );
    input.type = 'file';
    input.name = 'files';
    input.multiple = true;
    input.files = dT.files;

    const fakeChangeEvent = new Event('change');
    input.dispatchEvent(fakeChangeEvent);

    fixture.whenStable().then(() => {
      const testFile = input.files[0] as any;
      expect(testFile.preview).toBeUndefined();
      expect(testFile.binaryMimetype).toBeUndefined();
    });
  });

  it('should call OnChange when the file is octet mime type', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLInputElement = debugEl.querySelector('input');

    const dT = new ClipboardEvent('').clipboardData || new DataTransfer();
    dT.items.add(
      new File(['foo'], 'programmatically_created.exe', {
        type: 'application/octet-stream',
        lastModified: Date.now()
      })
    );
    input.type = 'file';
    input.name = 'files';
    input.multiple = true;
    input.files = dT.files;

    const fakeChangeEvent = new Event('change');
    input.dispatchEvent(fakeChangeEvent);

    fixture.whenStable().then(() => {
      const testFile = input.files[0] as any;
      expect(testFile.preview).toBeUndefined();
      expect(testFile.binaryMimetype).toBeUndefined();
    });
  });

  it('should call OnDrop when no files', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLElement = debugEl.querySelector('div');

    const fileDropEvent = new DragEvent('drop', {
      bubbles: true,
      dataTransfer: null
    });

    input.dispatchEvent(fileDropEvent);

    fixture.whenStable().then(() => {
      expect(fileDropEvent.dataTransfer.files).toBeUndefined();
    });
  });

  it('on drop should return file preview when file is valid file type', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLElement = debugEl.querySelector('div');

    const dT = new ClipboardEvent('').clipboardData || new DataTransfer();
    dT.items.add(
      new File(['foo'], 'programmatically_created.png', {
        type: 'image/png',
        lastModified: Date.now()
      })
    );

    const fileDropEvent = new DragEvent('drop', {
      bubbles: true,
      dataTransfer: dT
    });
    input.dispatchEvent(fileDropEvent);

    fixture.whenStable().then(() => {
      expect(fileDropEvent.dataTransfer.files).toBeDefined();
    });
  });
});
