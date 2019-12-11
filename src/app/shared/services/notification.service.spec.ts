import 'hammerjs';

import { TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MessageDialogComponent } from '../../shared/components/message-dialog/message-dialog.component';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let matDialog: MatDialog;
  let matSnackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserDynamicTestingModule,
        MatDialogModule,
        MatSnackBarModule
      ],
      declarations: [MessageDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: {} }]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [MessageDialogComponent] }
    });

    notificationService = TestBed.get(NotificationService);
    matDialog = TestBed.get(MatDialog);
    matSnackBar = TestBed.get(MatSnackBar);
  });

  afterEach(() => {
    matDialog.closeAll();
  });

  it('should be created', () => {
    expect(notificationService).toBeTruthy();
  });

  it('successful should be called without popup title', () => {
    spyOn(matDialog, 'open').and.callThrough();
    notificationService.successful('Created User successfully');
    expect(matDialog.open).toHaveBeenCalled();
  });

  it('successful should be called with popup title', () => {
    spyOn(matDialog, 'open').and.callThrough();
    notificationService.successful('Created User successfully', 'BaaS');
    expect(matDialog.open).toHaveBeenCalled();
  });

  it('waring should be called without popup title', () => {
    spyOn(matDialog, 'open').and.callThrough();
    notificationService.warning('Created User with warnings');
    expect(matDialog.open).toHaveBeenCalled();
  });

  it('warning should be called with popup title', () => {
    spyOn(matDialog, 'open').and.callThrough();
    notificationService.warning('Created User with warnings', 'BaaS');
    expect(matDialog.open).toHaveBeenCalled();
  });

  it('error should be called without popup title', () => {
    spyOn(matDialog, 'open').and.callThrough();
    notificationService.error('Created User Failed');
    expect(matDialog.open).toHaveBeenCalled();
  });

  it('error should be called with popup title', () => {
    spyOn(matDialog, 'open').and.callThrough();
    const test = notificationService.error('Created User Failed', 'BaaS');
    expect(matDialog.open).toHaveBeenCalled();
  });

  it('calling notify to have the code coverage', () => {
    spyOn(matSnackBar, 'open').and.callThrough();
    notificationService.notify('Created User');
    expect(matSnackBar.open).toHaveBeenCalled();
  });
});
