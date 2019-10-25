import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from './sidenavigation/sidenavigation.component';
import { RouterModule } from '@angular/router';

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
    RouterModule
  ],
  exports: [
    SideNavigationComponent,
    TopPageNavigationComponent,
    FooterComponent,
    HttpClientModule
  ]
})
export class CoreModule { }
