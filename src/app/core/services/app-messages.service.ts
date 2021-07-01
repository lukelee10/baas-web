import { Injectable } from '@angular/core';

export enum AppMessage {
  // *** MESSAGE CODES 1-999: Application Errors
  SessionTimeOut = 1,
  ViewResponseAPIError = 2,
  ViewResponseRequestsAPIError = 3,
  RequestDetailsError = 4,
  ServerOperationError = 5,
  // *** MESSAGE CODES 1000-1999: Application INFO Messages
  PasswordResetSubmission = 1000
  // *** MESSAGE CODES 2000-: Any Other Messages
}

@Injectable({
  providedIn: 'root'
})
export class AppMessagesService {
  json: any;
  constructor() {
    this.json = require('../../../assets/json/app-messages.json');
  }
  public getMessage(appMessage: AppMessage): string {
    return this.json.find(item => item.index === appMessage).message;
  }
  public getTitle(appMessage: AppMessage): string {
    return this.json.find(item => item.index === appMessage).title;
  }
}
