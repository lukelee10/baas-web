import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface ConfirmationDialogOptions {
  title?: string;
  message?: string;
}

/**
 * Component to use for a generic confirmation Material Dialig
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})

export class ConfirmationDialogComponent implements OnInit {
  options: ConfirmationDialogOptions;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogOptions>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogOptions,
  ) { }

  ngOnInit() {
    this.options = {...this.data};
  }

  /**
   * Dialog cancel event handler
   */
  onCancel() {
    this.dialogRef.close();
  }
}
