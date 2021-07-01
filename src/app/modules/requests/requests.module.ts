import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatFileUploadModule } from '../../shared/components/multi-file-upload/matFileUpload.module';
import { FspRequestsComponent } from './fsp/fsp-requests.component';
import { NonFspRequestsComponent } from './non-fsp/non-fsp-requests.component';
import { ProviderCheckboxesComponent } from './provider-checkboxes/provider-checkboxes.component';
import { RequestsRoutingModule } from './requests-routing.module';
import { RequestsComponent } from './requests.component';

@NgModule({
  declarations: [
    RequestsComponent,
    NonFspRequestsComponent,
    FspRequestsComponent,
    ProviderCheckboxesComponent
  ],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    MatFileUploadModule,
    ReactiveFormsModule
  ]
})
export class RequestsModule {}
