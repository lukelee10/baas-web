import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';
import { NotAllowedComponent } from './components/not-allowed/not-allowed.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TestPageComponent } from './components/test-page/test-page.component';
import { MaterialModule } from './material.module';

//import { NonFspFileUploadComponent } from './components/fsp-file-upload/fsp-file-upload.component';
@NgModule({
  declarations: [
    NotFoundComponent,
    NotAllowedComponent,
    TestPageComponent,
    LoaderComponent,
    MessageDialogComponent,
    ConfirmationDialogComponent
    //NonFspFileUploadComponent
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent
    //NonFspFileUploadComponent
  ],
  entryComponents: [ConfirmationDialogComponent, MessageDialogComponent]
})
export class SharedModule {}
