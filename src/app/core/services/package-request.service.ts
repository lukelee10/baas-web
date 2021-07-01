import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PackageRequestResponse } from '../../shared/models/package-requests';

@Injectable({
  providedIn: 'root'
})
export class PackageRequestService {
  private packageIdStr = '';

  constructor(private http: HttpClient) {}

  // Service URI Properties
  get packageId(): string {
    return this.packageIdStr;
  }
  set packageId(value: string) {
    this.packageIdStr = value;
  }

  public getEndPointURL() {
    const urlArr = [];
    urlArr.push(environment.apiGateway.url);
    urlArr.push('/requests?');
    if (this.packageIdStr.length > 0) {
      urlArr.push('packageId=' + this.packageIdStr);
    }
    return urlArr.join('');
  }

  public getPackageRequests(): Observable<PackageRequestResponse> {
    return this.http.get<PackageRequestResponse>(this.getEndPointURL());
  }
}
