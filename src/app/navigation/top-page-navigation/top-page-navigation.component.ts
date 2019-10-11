import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-page-navigation',
  templateUrl: './top-page-navigation.component.html',
  styleUrls: ['./top-page-navigation.component.scss']
})
export class TopPageNavigationComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
