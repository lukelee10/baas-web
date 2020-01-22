import { TestBed } from '@angular/core/testing';

import { MatFileUploadQueueComponent } from './matFileUploadQueue.component';

describe('MatFileUploadQueue', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatFileUploadQueueComponent]
    });
  });

  it('should work', () => {
    const fixture = TestBed.createComponent(MatFileUploadQueueComponent);
    expect(
      fixture.componentInstance instanceof MatFileUploadQueueComponent
    ).toBe(true, 'should create MatFileUploadQueue');
  });
});
