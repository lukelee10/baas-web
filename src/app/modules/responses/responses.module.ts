import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';

import { PackageListComponent } from './package-list/package-list.component';
import { ResponsesComponent } from './response-main/responses.component';
import { ResponsesRoutingModule } from './responses-routing.module';

@NgModule({
  declarations: [ResponsesComponent, PackageListComponent],
  imports: [
    CommonModule,
    ResponsesRoutingModule,
    FlexLayoutModule,
    SharedModule
  ]
})
export class ResponsesModule {}
