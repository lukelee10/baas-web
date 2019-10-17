import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ErrorPagesModule } from './errorpages/errorpages.module';
import { MaterialModule } from './material-ui/material.module';
import { NavigationModule } from './navigation/navigation.module';
import { RequestsModule } from './requests/requests.module';
import { TestpageComponent } from './testpage/testpage.component';

@NgModule({
  declarations: [
    AppComponent,
    TestpageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AdminModule,
    AppRoutingModule,
    ErrorPagesModule,
    MaterialModule,
    NavigationModule,
    RequestsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
