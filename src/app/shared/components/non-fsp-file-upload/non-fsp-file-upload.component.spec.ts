import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFspFileUploadComponent } from './non-fsp-file-upload.component';

describe('NonFspFileUploadComponent', () => {
  let component: NonFspFileUploadComponent;
  let fixture: ComponentFixture<NonFspFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonFspFileUploadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonFspFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
