import {
  Component,
  HostListener,
  Injectable,
  OnInit,
  ViewChild
} from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

import { FspRequestsComponent } from './fsp/fsp-requests.component';
import { NonFspRequestsComponent } from './non-fsp/non-fsp-requests.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  @ViewChild(NonFspRequestsComponent, { static: false })
  private specRequestComponent: NonFspRequestsComponent;

  @ViewChild(FspRequestsComponent, { static: false })
  private fspRequestComponent: FspRequestsComponent;
  constructor(public userService: UserService) {}

  ngOnInit() {}

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    event.returnValue = !this.isDirty();
  }

  isDirty() {
    return (
      (this.specRequestComponent && this.specRequestComponent.isDirty()) ||
      (this.fspRequestComponent && this.fspRequestComponent.isDirty())
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class RequestAuthenticationGuard
  implements CanDeactivate<RequestsComponent> {
  canDeactivate(component: RequestsComponent) {
    if (component.isDirty()) {
      return confirm('Are you sure you want to navigate away from this page?');
    } else {
      return true;
    }
  }
}
