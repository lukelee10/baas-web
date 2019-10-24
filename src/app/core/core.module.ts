import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from '../shared/material.module';
import { FooterComponent } from './footer/footer.component';
import { SideNavigationComponent } from './sidenavigation/sidenavigation.component';
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
    HttpClientModule
  ],
  exports: [
    SideNavigationComponent,
    TopPageNavigationComponent,
    FooterComponent,
    HttpClientModule
  ]
})
export class CoreModule { }
