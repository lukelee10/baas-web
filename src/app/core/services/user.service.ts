import { Injectable } from '@angular/core';
import { BaaSUser } from 'src/app/shared/models/user';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { UserRoles } from '../app-global-constants';
import { AwsLambdaService } from './aws-lambda.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private awsLambdaService: AwsLambdaService,
    private notificationService: NotificationService
  ) {}

  public InitializeUserSession(emailId: string) {
    this.awsLambdaService.getUserByEmailID(emailId).subscribe(
      data => {
        this.SetLocalSessions(data);
      },
      error => {
        this.notificationService.debugLogging('Error', error);
      }
    );
  }

  private SetLocalSessions(baaSUser: BaaSUser) {
    sessionStorage.setItem('CurrentUser', JSON.stringify(baaSUser));
  }

  get IsFSPUser(): boolean {
    return this.Role === UserRoles.FSPUser;
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
