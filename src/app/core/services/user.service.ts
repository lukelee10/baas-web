import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaaSUser } from 'src/app/shared/models/user';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { UserRoles } from '../app-global-constants';
import { AuthenticationService } from './authentication.service';
import { AwsLambdaService } from './aws-lambda.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private awsLambdaService: AwsLambdaService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {}

  public ShowMenuSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public InitializeUserSession(emailId: string) {
    this.awsLambdaService.getUserByEmailID(emailId).subscribe(
      (data: BaaSUser) => {
        this.SetLocalSessions(data);
      },
      error => {
        this.notificationService.debugLogging('Error', error);
      }
    );
  }
  private SetLocalSessions(baaSUser: BaaSUser) {
    sessionStorage.setItem('CurrentUser', JSON.stringify(baaSUser));
    this.GetLatestMenuContext();
  }
  public GetLatestMenuContext(pageHasMenu: boolean = true) {
    if (this.authenticationService.IsAuthenticated && pageHasMenu) {
      this.ShowMenuSubject.next(true);
    } else {
      this.ShowMenuSubject.next(false);
    }
  }

  get IsFSPUser(): boolean {
    return this.Role === UserRoles.FSPUser;
  }

  get IsAdmin(): boolean {
    return this.Role === UserRoles.Admin;
  }

  get IsLead(): boolean {
    return this.Role === UserRoles.Lead;
  }

  get UserId(): string {
    const currentUser = JSON.parse(sessionStorage.getItem('CurrentUser'));
    return currentUser.UserId;
  }

  get Disabled(): boolean {
    const currentUser = JSON.parse(sessionStorage.getItem('CurrentUser'));
    return /true/i.test(currentUser.Disabled);
  }

  get Fullname(): string {
    const currentUser = JSON.parse(sessionStorage.getItem('CurrentUser'));
    return currentUser.Fullname;
  }

  get GUID(): string {
    const currentUser = JSON.parse(sessionStorage.getItem('CurrentUser'));
    return currentUser.GUID;
  }

  get Group(): string {
    const currentUser = JSON.parse(sessionStorage.getItem('CurrentUser'));
    return currentUser.Group;
  }

  get Role(): string {
    const currentUser = JSON.parse(sessionStorage.getItem('CurrentUser'));
    return currentUser.Role;
  }
}
