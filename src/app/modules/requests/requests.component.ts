import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  constructor(private userService: UserService) {}
  public showNonFSPVersion = false;
  public showFSPVersion = false;

  classifications: classification[] = [
    { value: 'U-0', viewValue: 'U' },
    { value: 'U//FOUO-1', viewValue: 'U//FOUO' },
    { value: 'U//LES-2', viewValue: 'Fingerprint' }
  ];

  ngOnInit() {
    this.showFSPVersion = this.userService.IsFSPUser ? true : false;
    this.showNonFSPVersion = !this.userService.IsFSPUser ? true : false;
  }
}
interface classification {
  value: string;
  viewValue: string;
}
