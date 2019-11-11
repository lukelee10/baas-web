import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';

import { LoaderComponent } from './components/loader/loader.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NotAllowedComponent } from './components/not-allowed/not-allowed.component';
import { TestPageComponent } from './components/test-page/test-page.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    NotAllowedComponent,
    TestPageComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent
  ]
})
export class SharedModule { }
