import { FooterComponent } from './footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from './sidenavigation/sidenavigation.component';

import { MaterialModule } from '../shared/material.module';
import { TopPageNavigationComponent } from './toppagenavigation/toppagenavigation.component';

@NgModule({
  declarations: [
    SideNavigationComponent,
    TopPageNavigationComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    SideNavigationComponent,
    TopPageNavigationComponent,
    FooterComponent
  ]
})
export class CoreModule { }
