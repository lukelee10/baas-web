import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isAuthenticated: boolean;

  constructor() {
    this.isAuthenticated = false;
  }

  get IsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  set IsAuthenticated(value: boolean) {
    this.isAuthenticated = value;
  }

  get isAdmin(): boolean {
    return true;
  }
}
