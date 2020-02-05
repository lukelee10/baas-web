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
  sidenavBgColor = 'white';
  sideNavCursor = 'default';
  sideNavContentsShow = true;
  titleFlex = 80;
  iconFlex = 20;

  readonly collapsedMiddleNavWidth = 3;
  readonly expandedMiddleNavWidth = 25;

  middleNavWidth = this.expandedMiddleNavWidth;
  middleNavTitle = 'View Control';
  middleNavIcon = 'keyboard_arrow_left';
  middleNavToolTip = 'Click to Collapse';
  middleNavBgColor = 'white';
  middleNavContentsShow = true;
  middleNavCursor = 'default';
  titleMiddleFlex = 80;
  iconMiddleFlex = 20;

  constructor() {}

  ngOnInit() {}

  private expandSidenav() {
    this.sidenavWidth = this.expandedWidth;
    this.sideNavTitle = 'View Control';
    this.sideNavIcon = 'keyboard_arrow_left';
    this.sideNavContentsShow = true;
    this.sideNavToolTip = 'Click to Collapse';
    this.titleFlex = 80;
    this.iconFlex = 20;
    this.sidenavBgColor = 'white';
    this.sideNavCursor = 'default';
  }
  private collapseSideNav() {
    this.sidenavWidth = this.collapsedWidth;
    this.sideNavTitle = '-';
    this.sideNavIcon = 'keyboard_arrow_right';
    this.sideNavContentsShow = false;
    this.sideNavToolTip = 'Click to Expand';
    this.titleFlex = 40;
    this.iconFlex = 60;
    this.sidenavBgColor = '#D3D3D3';
    this.sideNavCursor = 'pointer';
  }

  toggleSearch() {
    if (this.sidenavWidth === this.collapsedWidth) {
      this.expandSidenav();
    } else {
      this.collapseSideNav();
    }
  }

  private expandmiddleNav() {
    this.middleNavWidth = this.expandedMiddleNavWidth;
    this.middleNavTitle = 'View Packages';
    this.middleNavIcon = 'keyboard_arrow_left';
    this.middleNavContentsShow = true;
    this.middleNavToolTip = 'Click to Collapse';
    this.titleMiddleFlex = 80;
    this.iconMiddleFlex = 20;
    this.middleNavBgColor = 'white';
    this.middleNavCursor = 'default';
  }
  private collapsemiddleNav() {
    this.middleNavWidth = this.collapsedMiddleNavWidth;
    this.middleNavTitle = '-';
    this.middleNavIcon = 'keyboard_arrow_right';
    this.middleNavContentsShow = false;
    this.middleNavToolTip = 'Click to Expand';
    this.titleMiddleFlex = 40;
    this.iconMiddleFlex = 60;
    this.middleNavBgColor = '#B0C4DE';
    this.middleNavCursor = 'pointer';
  }

  togglePackages() {
    if (this.middleNavWidth === this.collapsedWidth) {
      this.expandmiddleNav();
    } else {
      this.collapsemiddleNav();
    }
  }
}
