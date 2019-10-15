import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotAllowedComponent } from './notallowed/notallowed.component';
import { NotFoundComponent } from './notfound/notfound.component';


@NgModule({
  declarations: [NotAllowedComponent, NotFoundComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ErrorPagesModule { }
