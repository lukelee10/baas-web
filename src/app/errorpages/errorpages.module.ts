import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotallowedComponent } from './notallowed/notallowed.component';
import { NotfoundComponent } from './notfound/notfound.component';


@NgModule({
  declarations: [NotallowedComponent, NotfoundComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ErrorpagesModule { }
