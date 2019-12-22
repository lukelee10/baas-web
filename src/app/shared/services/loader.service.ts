/**
 * LoaderService service is to show Busy/Loading popup during http requests/lengthy processes
 * To use:
 * 1. Add private loaderService: LoaderService in component constructor
 * 2. this.loaderService.Show(optional message to display in popup); -> to show popup
 * 3. this.loaderService.Hide(); -> to hide popup window
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoadinngSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>(null);

  isLoading$: Observable<boolean> = this.isLoadinngSubject.asObservable();
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor() {}

  Show(message?: string) {
    this.isLoadinngSubject.next(true);
    this.messageSubject.next(message ? message : 'Loading...');
  }

  Hide() {
    this.isLoadinngSubject.next(false);
  }
}
