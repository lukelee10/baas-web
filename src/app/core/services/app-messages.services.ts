import { Injectable } from '@angular/core';

export enum AppMessage {
  SessionTimeOut = 1
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
