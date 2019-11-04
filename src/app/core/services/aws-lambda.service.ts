import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { first, finalize } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

import { apiGateway } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaService {
  private apiBase: string;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.apiBase = apiGateway.url;
  }

  get GetJwtToken(): string {
    return this.authenticationService.GetJwtToken;
  }

  set SetJwtToken(value: string) {
    this.authenticationService.SetJwtToken = value;
  }


  auditLogin() {
    const jwtToken = this.GetJwtToken;

    const headers = new HttpHeaders()
    .set('Authorization', jwtToken);
//    .set('X-XSS-Protection', '1; mode=block');

    this.http.post(this.apiBase + '/audit',
    {
      email: 'admin@baas.devver1',
      action: 'Login'
    },
    {
      headers
    })
    .subscribe(
      response => {
        const test = JSON.stringify(response);
        console.log('AUDIT LOGIN PASSED' + test);
      },
      error => {
        console.log('AUDIT LOGIN FAILED' + JSON.stringify(error));
      }
    );
  }
}
