import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { RequestDetails } from '../../shared/models/request-details';

@Injectable({
  providedIn: 'root'
})
export class RequestDetailService {
  private isMockService = false;
  private requestIdStr = '';
  constructor(private http: HttpClient) {}
  // Service URI Properties
  get requestId(): string {
    return this.requestIdStr;
  }
  set requestId(value: string) {
    this.requestIdStr = value;
  }

  // Service Specific Properties
  // TODO : This property will be deprecated, and eventually removed
  public set isMock(value: boolean) {
    this.isMockService = value;
  }

  public getEndPointURL() {
    const urlArr = [];
    if (this.isMockService) {
      urlArr.push('../../../assets/json/mock/request-details.json');
    } else {
      urlArr.push(environment.apiGateway.url);
      urlArr.push('/requestDetails?');
      if (this.requestIdStr.length > 0) {
        urlArr.push('requestId=' + this.requestIdStr);
      }
    }
    return urlArr.join('');
  }

  public getRequestDetails(): Observable<RequestDetails> {
    return this.http
      .get<RequestDetails>(this.getEndPointURL())
      .pipe(delay(!this.isMockService ? 0 : 500));
  }
}
