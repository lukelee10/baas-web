import 'hammerjs';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material';

import { MessageDialogComponent } from './message-dialog.component';

describe('MessageDialogComponent', () => {
  let component: MessageDialogComponent;
  let fixture: ComponentFixture<MessageDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  describe('Success Message Dialog box without any options data', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MatDialogModule],
        declarations: [MessageDialogComponent],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: {} }
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(MessageDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('onClose should close the dialog', () => {
      component.onClose();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Success Message Dialog box', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MatDialogModule],
        declarations: [MessageDialogComponent],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              success: true
            }
          }
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(MessageDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('onClose should close the dialog', () => {
      component.onClose();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should be a success dialog', () => {
      expect(component.options.success).toBe(true);
    });

    it('should have the title "SUCCESS"', () => {
      expect(component.options.title).toBe('SUCCESS');
    });
  });

  describe('Warning Message Dialog box', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MatDialogModule],
        declarations: [MessageDialogComponent],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              warn: true
            }
          }
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(MessageDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('onClose should close the dialog', () => {
      component.onClose();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should be a warning dialog', () => {
      expect(component.options.warn).toBe(true);
    });

    it('should have the title "WARNING"', () => {
      expect(component.options.title).toBe('WARNING');
    });
  });

  describe('Error Message Dialog box', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MatDialogModule],
        declarations: [MessageDialogComponent],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              error: true
            }
          }
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(MessageDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('onClose should close the dialog', () => {
      component.onClose();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should be an error dialog', () => {
      expect(component.options.error).toBe(true);
    });

    it('should have the title "ERROR"', () => {
      expect(component.options.title).toBe('ERROR');
    });
  });
});
