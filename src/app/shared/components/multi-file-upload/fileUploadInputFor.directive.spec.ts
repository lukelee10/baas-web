import { Component, HostListener } from '@angular/core';
import { FileUploadInputForDirective } from './fileUploadInputFor.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Simple test component that will not in the actual app
@Component({
  template:
    '<div [fileUploadInputFor]="fileUploadQueue"><input [fileUploadInputFor]="fileUploadQueue"/></div>'
})
class TestComponent {
  constructor() {}

  @HostListener('change')
  onChange() {}

  @HostListener('drop', ['$event'])
  onDrop(event: any): any {}
}

describe('FileUploadInputForDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, FileUploadInputForDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should call OnChange when no files', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLInputElement = debugEl.querySelector('input');

    const fakeChangeEvent = new Event('change');
    input.dispatchEvent(fakeChangeEvent);

    fixture.whenStable().then(() => {
      console.log(JSON.stringify(input.files));
      expect(input.files).toBeNull();
    });
  });

  it('should call OnChange when the file is png mime type', () => {
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
      console.log(JSON.stringify(input.files));
      expect(input.files).not.toBeNull();
    });
  });

  xit('should call OnChange when the file is jp2 mime type', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLInputElement = debugEl.querySelector('input');

    const dT = new ClipboardEvent('').clipboardData || new DataTransfer();
    dT.items.add(
      new File(['foo'], 'programmatically_created.jp2', {
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
      console.log(JSON.stringify(input.files));
      expect(input.files).not.toBeNull();
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
      console.log(JSON.stringify(input.files));
      expect(input.files).not.toBeNull();
    });
  });

  it('should call OnDrop when no files', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLElement = debugEl.querySelector('div');

    const fakeDropEvent = new Event('drop');
    input.dispatchEvent(fakeDropEvent);

    fixture.whenStable().then(() => {
      //      console.log(JSON.stringify(input));
      //      expect(input).not.toBeNull();
    });
  });
});
