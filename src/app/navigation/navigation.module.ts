import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material-ui/material.module';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { TopPageNavigationComponent } from './top-page-navigation/top-page-navigation.component';


@NgModule({
  declarations: [
    SidenavListComponent,
    TopPageNavigationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    SidenavListComponent,
    TopPageNavigationComponent
  ]
})

export class NavigationModule { }
