import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserPackageResponse } from '../../shared/models/user-package';

@Injectable({
  providedIn: 'root'
})
export class UserPackageService {
  private sortOrderStr = 'desc';
  private sizeOfPage = 100;
  private startingItemHash = '';
  private isMockService = false;

  constructor(private http: HttpClient) {}

  // Service URI Properties
  get sortOrder(): string {
    return this.sortOrderStr;
  }
  set sortOrder(value: string) {
    this.sortOrderStr = value;
  }

  get pageSize(): number {
    return this.sizeOfPage;
  }
  set pageSize(value: number) {
    this.sizeOfPage = value;
  }

  get startingItem(): string {
    return this.startingItemHash.trim();
  }
  set startingItem(value: string) {
    this.startingItemHash = value.trim();
  }

  // Service Specific Properties
  // TODO : This property will be deprecated, and eventually removed
  public set isMock(value: boolean) {
    this.isMockService = value;
  }

  public getEndPointURL() {
    const urlArr = [];
    if (this.isMockService) {
      if (this.sortOrderStr === 'desc') {
        urlArr.push('../../../assets/json/mock/baas-mock-packages.json');
      } else {
        urlArr.push('../../../assets/json/mock/baas-mock-packages-asc.json');
      }
    } else {
      urlArr.push(environment.apiGateway.url);
      urlArr.push('/packages?');
      urlArr.push('size=' + this.sizeOfPage.toString());
      urlArr.push('&order=' + this.sortOrderStr);
      if (this.startingItemHash.length > 0) {
        urlArr.push('&start=' + this.startingItemHash);
      }
    }
    return urlArr.join('');
  }

  public getPackages(): Observable<UserPackageResponse> {
    return this.http
      .get<UserPackageResponse>(this.getEndPointURL())
      .pipe(delay(!this.isMockService ? 0 : 500));
  }
}
