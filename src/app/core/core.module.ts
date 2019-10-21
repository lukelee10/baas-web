import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from './sidenavigation/sidenavigation.component';

import { MaterialModule } from '../shared/material.module';
import { TopPageNavigationComponent } from './toppagenavigation/toppagenavigation.component';

@NgModule({
  declarations: [
    SideNavigationComponent,
    TopPageNavigationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    SideNavigationComponent,
    TopPageNavigationComponent
  ]
})
export class CoreModule { }
