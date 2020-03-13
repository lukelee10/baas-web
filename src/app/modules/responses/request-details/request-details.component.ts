import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Request } from 'src/app/shared/models/package-requests';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<RequestDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public request: Request
  ) {}

  closePopup(): void {
    this.dialogRef.close();
  }
}
