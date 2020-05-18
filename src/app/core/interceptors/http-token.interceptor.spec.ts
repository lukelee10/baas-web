import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { HttpTokenInterceptor } from './http-token.interceptor';
import { AuthenticationService } from '../services/authentication.service';

describe('Http Token Interceptor', () => {
  const mockAuthService = {
    LoggedUser: 'fakeUser',
    JwtToken: 'fakeToken'
  };

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpTokenInterceptor,
          multi: true
        }
      ]
    });
  });

  afterEach(inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      httpMock.verify();
    }
  ));

  describe('making http call should add proper authorization token', () => {
    it('adds Authorization header', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http
          .get('/fakecall')
          .subscribe(response => expect(response).toBeTruthy());
        const request = httpMock.expectOne(
          req =>
            req.headers.has('Authorization') &&
            req.headers.get('Authorization') === `${mockAuthService.JwtToken}`
        );

        expect(request.request.method).toEqual('GET');
      }
    ));
  });
});
