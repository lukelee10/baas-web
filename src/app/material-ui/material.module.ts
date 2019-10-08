import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatSliderModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

const MaterialComponents = [
  MatButtonModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatSliderModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule,
  FlexLayoutModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})

export class MaterialModule { }
