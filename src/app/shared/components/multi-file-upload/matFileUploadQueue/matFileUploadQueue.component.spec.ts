import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatSelect
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserRoles } from 'src/app/core/app-global-constants';
import { UserService } from 'src/app/core/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatFileUploadQueueComponent } from './matFileUploadQueue.component';

class MockUserService extends UserService {
  get Role(): string {
    return UserRoles.NonFSPUser;
  }
}

describe('MatFileUploadQueueComponent', () => {
  let component: MatFileUploadQueueComponent;
  let fixture: ComponentFixture<MatFileUploadQueueComponent>;

  const testImage = (): File => {
    // prettier-ignore
    const data = new Uint8Array([
          137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 8, 0,
          0, 0, 8, 8, 2, 0, 0, 0, 75, 109, 41, 220,  0,  0,  0,  34,  73,  68,  65,  84,
          8,  215,  99,  120,  173,  168,  135,  21,  49,  0,  241,  255,  15,  90,  104,
          8,  33,  129,  83,  7,  97,  163,  136,  214,  129,  93,  2,  43,  2,  0,  181,
          31,  90,  179,  225,  252,  176,  37,  0,  0,  0,  0,  73,  69,  78,  68,  174,
          66,  96,  130
      ]);
    const blob = new Blob([data]);
    const file = new File([blob], 'sample.png', {
      type: 'image/png',
      lastModified: Date.now()
    });
    return file;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatProgressBarModule,
        MatIconModule,
        BrowserAnimationsModule,
        SharedModule,
        MatCardModule,
        HttpClientTestingModule
      ],
      declarations: [MatFileUploadQueueComponent],
      providers: [{ provide: UserService, useClass: MockUserService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatFileUploadQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test removeAll(), Upon remove all files, there should be no files ', () => {
    component.add(testImage);
    component.removeAll();
    expect(component.files.length <= 0).toBeTruthy();
  });

  it('Test getQueueData ', () => {
    expect(component.getQueueData().toArray().length <= 0).toBeTruthy();
  });

  it('Test add file ', () => {
    component.add(testImage);
    expect(component.files.length > 0).toBeTruthy();
  });
  it('Test Classification Apply All ', () => {
    const spy = spyOn(component, 'onClassificationChange').and.callThrough();
    expect(spy).not.toHaveBeenCalled();
    fixture.debugElement
      .query(By.css('.classificationApplyAll'))
      .triggerEventHandler('selectionChange', {
        source: MatSelect,
        value: 'U'
      });
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('Test Modality Apply All ', () => {
    const spy = spyOn(component, 'onModalityChange').and.callThrough();
    expect(spy).not.toHaveBeenCalled();
    fixture.debugElement
      .query(By.css('.modalityApplyAll'))
      .triggerEventHandler('selectionChange', {
        source: MatSelect,
        value: 'Face'
      });
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
