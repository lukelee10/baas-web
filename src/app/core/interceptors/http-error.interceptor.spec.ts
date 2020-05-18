import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MatSnackBarRef } from '@angular/material/snack-bar';

import { HttpTokenInterceptor } from './http-token.interceptor';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { AuthenticationService } from './../services/authentication.service';
import { NotificationService } from './../../shared/services/notification.service';
import { AppMessage } from './../services/app-messages.service';
import { AppMessagesService } from './../services/app-messages.service';
import { AppGlobalConstants } from './../app-global-constants';

describe('Http Error Interceptor', () => {
  let notificationSuccess = 0;
  let notificationWarning = 0;
  let notificationError = 0;
  let notificationLog = 0;
  let logoutCounter = 0;

  const notificationServiceStub: Partial<NotificationService> = {
    setPopUpTitle(title: string) {},
    notify(title: string): MatSnackBarRef<any> {
      return null;
    },
    successful(msg: string) {
      console.log('notification service success!!!');
      notificationSuccess++;
    },
    warning(msg: string) {
      notificationWarning++;
    },
    error(msg: string) {
      notificationError++;
    },
    debugLogging(msg: string) {
      notificationLog++;
    }
  };

  const appMessagesServiceStub: Partial<AppMessagesService> = {
    getMessage(appMessage: AppMessage): string {
      return 'Testing Message';
    },
    getTitle(appMessage: AppMessage): string {
      return 'Testing Title';
    }
  };

  const mockAuthService = {
    LoggedUser: 'fakeUser',
    JwtToken: 'fakeToken',
    Logout() {
      logoutCounter++;
    }
  };

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: NotificationService, useValue: notificationServiceStub },
        { provide: AppMessagesService, useValue: appMessagesServiceStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpTokenInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
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

  describe('making http call then server returns Invalid Http Request response code', () => {
    let response: any;
    let errResponse: any;
    const mockErrorResponse = {
      status: AppGlobalConstants.HttpErrorResponseCode.InvalidHttpRequest,
      statusText: 'Invalid Http Request'
    };
    const errorMessage =
      'Error: Http failure response for /fakecall: 400 Invalid Http Request';

    it('client return 400 Invalid Http Request', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );

        httpMock.expectOne('/fakecall').flush(errorMessage, mockErrorResponse);
        expect(errResponse).toBe(errorMessage);
      }
    ));
  });

  describe('making http call then server returns Unauthorized response code', () => {
    let response: any;
    let errResponse: any;
    const mockErrorResponse = {
      status: AppGlobalConstants.HttpErrorResponseCode.UnathorizedAccess,
      statusText: 'Unauthorized Http Request'
    };
    const errorMessage =
      'Error: Http failure response for /fakecall: 401 Unauthorized Http Request';

    it('client return 401 Unauthorized Http Request', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );

        httpMock.expectOne('/fakecall').flush(errorMessage, mockErrorResponse);
        expect(errResponse).toBe(errorMessage);
      }
    ));
  });

  describe('making http call then server returns TimeOut Error response code', () => {
    let response: any;
    let errResponse: any;
    const mockErrorResponse = {
      status: AppGlobalConstants.HttpErrorResponseCode.TimeOutErrorCode,
      statusText: 'Http Request Session Timedout'
    };
    const errorMessage =
      'Error: Http failure response for /fakecall: 408 Http Request Session Timedout';

    it('client return undefined error response', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );

        httpMock.expectOne('/fakecall').flush(errorMessage, mockErrorResponse);
        expect(errResponse).toBeUndefined();
      }
    ));
  });

  describe('making http call then server returns Internal Error response code', () => {
    let response: any;
    let errResponse: any;
    const mockErrorResponse = {
      status: 500,
      statusText: 'Failed due to Internal Error'
    };
    const errorMessage = `Error: ${appMessagesServiceStub.getMessage(
      AppMessage.ServerOperationError
    )}`;

    it('client return Internal Error Code', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );

        httpMock.expectOne('/fakecall').flush(errorMessage, mockErrorResponse);
        expect(errResponse).toBe(errorMessage);
      }
    ));
  });

  describe('making http call then client throws client side error', () => {
    let response: any;
    let errResponse: any;

    it('client return undefined error message', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );

        httpMock.expectOne('/fakecall').error(new ErrorEvent('Client error'));
        expect(errResponse).toBeUndefined();
      }
    ));
  });
});
