import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  public showNonFSPVersion = false;
  public showFSPVersion = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.showFSPVersion = this.userService.IsFSPUser ? true : false;
    this.showNonFSPVersion = !this.userService.IsFSPUser ? true : false;
  }
}
