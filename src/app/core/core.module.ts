import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from './sidenavigation/sidenavigation.component';
import { RouterModule } from '@angular/router';

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
    RouterModule
  ],
  exports: [
    SideNavigationComponent,
    TopPageNavigationComponent
  ]
})
export class CoreModule { }
