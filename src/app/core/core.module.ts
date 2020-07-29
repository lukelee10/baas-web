import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../shared/material.module';
import { FooterComponent } from './footer/footer.component';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { HttpTokenInterceptor } from './interceptors/http-token.interceptor';
import { SideNavigationComponent } from './sidenavigation/sidenavigation.component';
import { TopPageNavigationComponent } from './toppagenavigation/toppagenavigation.component';

@NgModule({
  declarations: [
    SideNavigationComponent,
    TopPageNavigationComponent,
    FooterComponent
  ],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [
    SideNavigationComponent,
    TopPageNavigationComponent,
    FooterComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ]
})

/**
 * Core module
 * This module provides singletons used across the project, primarily data
 * services.  All exports from this module will be instantiated as singletons.
 *
 * Note: You do not need to import this module (it is imported in the root module),
 * just import each individual service or item needed
 */
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
