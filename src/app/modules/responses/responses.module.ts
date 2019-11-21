import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsesRoutingModule } from './responses-routing.module';

import { ResponsesComponent } from './responses.component';


@NgModule({
  declarations: [
    ResponsesComponent
  ],
  imports: [
    CommonModule,
    ResponsesRoutingModule
  ]
})
export class ResponsesModule { }
