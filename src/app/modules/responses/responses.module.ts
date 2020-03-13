import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  VettingStatusPipe,
  VettingStatusShortenPipe
} from 'src/app/core/pipes/vetting-status-shorten.pipe';
import { SharedModule } from 'src/app/shared/shared.module';

import { PackageListComponent } from './package-list/package-list.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { RequestListComponent } from './request-list/request-list.component';
import { ResponsesComponent } from './response-main/responses.component';
import { ResponsesRoutingModule } from './responses-routing.module';

@NgModule({
  declarations: [
    ResponsesComponent,
    PackageListComponent,
    RequestListComponent,
    VettingStatusShortenPipe,
    VettingStatusPipe,
    RequestDetailsComponent
  ],
  imports: [
    CommonModule,
    ResponsesRoutingModule,
    FlexLayoutModule,
    SharedModule
  ],
  entryComponents: [RequestDetailsComponent]
})
export class ResponsesModule {}
