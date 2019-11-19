import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/**
 * Interface to define the options for the Message dialog
 */
export interface MessageDialogOptions {
  title?: string;
  message?: string;

  /** Set to true for styling the dialog with a 'success' theme */
  success?: boolean;

  /** Set to true for styling the dialog with a 'warn' theme */
  warn?: boolean;

  /** Set to true for styling the dialog with a 'error' theme */
  error?: boolean;
}

/**
 * Component to use for a generic message Material Dialog
 * Use the options of 'success', 'warn', and 'error' to style the dialog accordingly
 */
@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {
  options: MessageDialogOptions;

  constructor(
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MessageDialogOptions
  ) { }

  ngOnInit() {
    this.options = {...this.data};

    if (this.options.success && !this.options.title) {
      this.options.title = 'SUCCESS';
    } else if (this.options.warn && !this.options.title) {
      this.options.title = 'WARNING';
    } else if (this.options.error && !this.options.title) {
      this.options.title = 'ERROR';
    }
  }

  /**
   * Dialog close event handler
   */
  onClose() {
    this.dialogRef.close();
    this.cdRef.detectChanges();
  }
}
