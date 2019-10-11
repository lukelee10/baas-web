import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreateRequestComponent } from './create-request/create-request.component';
import { RequestsComponent } from './requests/requests.component';


@NgModule({
  declarations: [RequestsComponent, CreateRequestComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class RequestsModule { }
