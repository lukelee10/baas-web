import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../material.module';
import { BytesPipe } from './bytes.pipe';
import { FileUploadInputForDirective } from './fileUploadInputFor.directive';
import { MatFileUploadComponent } from './matFileUpload/matFileUpload.component';
import { MatFileUploadQueueComponent } from './matFileUploadQueue/matFileUploadQueue.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    MaterialModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    MatFileUploadComponent,
    MatFileUploadQueueComponent,
    FileUploadInputForDirective,
    BytesPipe
  ],
  exports: [
    MatFileUploadComponent,
    MatFileUploadQueueComponent,
    FileUploadInputForDirective,
    BytesPipe
  ]
})
export class MatFileUploadModule {}
