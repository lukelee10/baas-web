import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../material.module';
import { BytesPipe } from './bytes.pipe';
import { FileUploadInputFor } from './fileUploadInputFor.directive';
import { MatFileUpload } from './matFileUpload/matFileUpload.component';
import { MatFileUploadQueue } from './matFileUploadQueue/matFileUploadQueue.component';

@NgModule({
  imports: [MaterialModule, HttpClientModule, CommonModule],
  declarations: [
    MatFileUpload,
    MatFileUploadQueue,
    FileUploadInputFor,
    BytesPipe
  ],
  exports: [MatFileUpload, MatFileUploadQueue, FileUploadInputFor, BytesPipe]
})
export class MatFileUploadModule {}
