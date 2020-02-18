import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {
  isOpen = true;

  readonly collapsedWidth = 3;
  readonly expandedWidth = 15;

  sidenavWidth = this.expandedWidth;
  sideNavTitle = 'View Control';
  sideNavIcon = 'keyboard_arrow_left';
  sideNavToolTip = 'Click to Collapse';

  sideNavContentsShow = true;
  titleFlex = 85;
  iconFlex = 15;

  readonly collapsedMiddleNavWidth = 3;
  readonly expandedMiddleNavWidth = 25;

  middleNavWidth = this.expandedMiddleNavWidth;
  middleNavTitle = 'Packages';
  middleNavIcon = 'keyboard_arrow_left';
  middleNavToolTip = 'Click to Collapse';
  currentSortIcon = 'arrow_downward';
  packageSortOrder = 'desc';
  sortDirection = 'Sort Order: Package Creation Date Descending';
  middleNavBgColor = '#eaf2f8';
  pacakageIDToLoadRequests = '';

  middleNavContentsShow = true;

  titleMiddleFlex = 90;
  iconMiddleFlex = 10;

  constructor() {}

  ngOnInit() {}

  toggleSearch() {
    if (this.sidenavWidth === this.collapsedWidth) {
      this.expandSidenav();
    } else {
      this.collapseSideNav();
    }
  }

  private expandSidenav() {
    this.sidenavWidth = this.expandedWidth;
    this.sideNavTitle = 'View Control';
    this.sideNavIcon = 'keyboard_arrow_left';
    this.sideNavContentsShow = true;
    this.sideNavToolTip = 'Click to Collapse';
    this.titleFlex = 85;
    this.iconFlex = 15;
  }
  private collapseSideNav() {
    this.sidenavWidth = this.collapsedWidth;
    this.sideNavTitle = '';
    this.sideNavIcon = 'menu';
    this.sideNavContentsShow = false;
    this.sideNavToolTip = 'Click to Expand';
    this.titleFlex = 5;
    this.iconFlex = 95;
  }

  togglePackages() {
    if (this.middleNavWidth === this.collapsedWidth) {
      this.expandmiddleNav();
    } else {
      this.collapsemiddleNav();
    }
  }

  private expandmiddleNav() {
    this.middleNavWidth = this.expandedMiddleNavWidth;
    this.middleNavTitle = 'Packages';
    this.middleNavIcon = 'keyboard_arrow_left';
    this.middleNavContentsShow = true;
    this.middleNavToolTip = 'Click to Collapse';
    this.titleMiddleFlex = 90;
    this.iconMiddleFlex = 10;
  }
  private collapsemiddleNav() {
    this.middleNavWidth = this.collapsedMiddleNavWidth;
    this.middleNavTitle = '';
    this.middleNavIcon = 'menu';
    this.middleNavContentsShow = false;
    this.middleNavToolTip = 'Click to Expand';
    this.titleMiddleFlex = 5;
    this.iconMiddleFlex = 95;
  }

  toggleSort() {
    // currentSortIcon = 'arrow_downward';
    if (this.currentSortIcon === 'arrow_downward') {
      // it was on Package Creation Date DESC order, now implement ASC --> Oldest  Package on Top
      this.currentSortIcon = 'arrow_upward';
      this.packageSortOrder = 'asc';
      this.sortDirection = 'Sort Order: Package Creation Date Ascending';
    } else {
      // it was on Package Creation Date  ASC order, now implement DESC --> Latest Package on Top
      this.currentSortIcon = 'arrow_downward';
      this.packageSortOrder = 'desc';
      this.sortDirection = 'Sort Order: Package Creation Date Descending';
    }
  }

  packageClick(packageID) {
    console.log('==========' + packageID);
    this.pacakageIDToLoadRequests = packageID;
  }
}
