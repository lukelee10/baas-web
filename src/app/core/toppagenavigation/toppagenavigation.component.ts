import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toppagenavigation',
  templateUrl: './toppagenavigation.component.html',
  styleUrls: ['./toppagenavigation.component.scss']
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
