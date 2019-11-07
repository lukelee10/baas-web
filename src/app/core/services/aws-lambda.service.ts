import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NotificationService } from './../../shared/services/notification.service';

import { apiGateway } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaService {
  private apiBase: string;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.apiBase = apiGateway.url;
  }

  auditLog(email: string, action: string) {
    const body = {
      email,
      action
    };

    this.http.post(this.apiBase + '/audit', body)
    .subscribe(
      response => {
        const result = JSON.stringify(response);
      },
      error => {
        const message = JSON.stringify(error);
        this.notificationService.show('Audit ' +  action  + ' Failed');
      }
    );
  }
}
