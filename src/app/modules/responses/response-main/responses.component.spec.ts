import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  VettingStatusPipe,
  VettingStatusShortenPipe
} from 'src/app/core/pipes/vetting-status-shorten.pipe';
import { UserPackage } from 'src/app/shared/models/user-package';

import { PackageListComponent } from '../package-list/package-list.component';
import { RequestListComponent } from '../request-list/request-list.component';
import { SharedModule } from './../../../shared/shared.module';
import { ResponsesComponent } from './responses.component';

describe('ResponsesComponent', () => {
  let component: ResponsesComponent;
  let fixture: ComponentFixture<ResponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SharedModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        FlexLayoutModule
      ],
      declarations: [
        ResponsesComponent,
        PackageListComponent,
        RequestListComponent,
        VettingStatusShortenPipe,
        VettingStatusPipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Verify the component is created successfully', () => {
    expect(component).toBeTruthy();
  });

  it('Verify the Search Column Expansion', () => {
    component.sidenavWidth = component.collapsedWidth;
    component.toggleSearch();
    expect(component.sidenavWidth === component.expandedWidth).toBeTruthy();
  });

  it('Verify the Search Column Collapse', () => {
    component.sidenavWidth = component.expandedWidth;
    component.toggleSearch();
    expect(component.sidenavWidth === component.collapsedWidth).toBeTruthy();
  });

  it('Verify the Packages (Middle) Column Expansion', () => {
    component.middleNavWidth = component.collapsedWidth;
    component.togglePackages();
    expect(
      component.middleNavWidth === component.expandedMiddleNavWidth
    ).toBeTruthy();
  });

  it('Verify the  Packages (Middle) Column Collapse', () => {
    component.sidenavWidth = component.expandedMiddleNavWidth;
    component.togglePackages();
    expect(
      component.middleNavWidth === component.collapsedMiddleNavWidth
    ).toBeTruthy();
  });

  it('Verify the  Sort - Ascending', () => {
    component.currentSortIcon = 'arrow_downward';
    component.toggleSort();
    expect(component.packageSortOrder === 'asc').toBeTruthy();
  });

  it('Verify the  Sort -Descending', () => {
    component.currentSortIcon = 'arrow_upward';
    component.toggleSort();
    expect(component.packageSortOrder === 'desc').toBeTruthy();
  });

  it('Verify the  proper packageClick propagation', () => {
    const userPackage: UserPackage = {
      PackageId: '1234ABCD',
      Created: undefined,
      Name: undefined,
      RequestCount: undefined,
      User: undefined,
      Group: undefined
    };
    component.packageClick(userPackage);
    expect(component.selectedPackageObj.PackageId === '1234ABCD').toBeTruthy();
  });
});
