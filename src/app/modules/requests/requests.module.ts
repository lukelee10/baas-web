import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { FspRequestsComponent } from './fsp-requests.component';
import { NonFspRequestsComponent } from './non-fsp-requests.component';
import { RequestsRoutingModule } from './requests-routing.module';
import { RequestsComponent } from './requests.component';

@NgModule({
  declarations: [
    RequestsComponent,
    NonFspRequestsComponent,
    FspRequestsComponent
  ],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RequestsModule {}
