import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatFileUploadModule } from '../../shared/components/multi-file-upload/matFileUpload.module';
import { RequestsRoutingModule } from './requests-routing.module';
import { RequestsComponent } from './requests.component';

@NgModule({
  declarations: [RequestsComponent],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    SharedModule,
    MatFileUploadModule
  ]
})
export class RequestsModule {}
