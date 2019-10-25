import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NotAllowedComponent } from './components/not-allowed/not-allowed.component';
import { TestPageComponent } from './components/test-page/test-page.component';

@NgModule({
  declarations: [NotFoundComponent, NotAllowedComponent, TestPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
