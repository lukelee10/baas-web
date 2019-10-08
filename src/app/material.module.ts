import { NgModule } from '@angular/core';
import {
  MatSliderModule,
  MatButtonModule,
  MatGridListModule
} from '@angular/material';

const MaterialComponents = [
  MatSliderModule,
  MatButtonModule,
  MatGridListModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})

export class MaterialModule { }
