import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { NotificationService } from './../../shared/services/notification.service';
import { AppGlobalConstants } from './../app-global-constants';
import {
  AppMessage,
  AppMessagesService
} from './../services/app-messages.service';
import { AuthenticationService } from './../services/authentication.service';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { HttpTokenInterceptor } from './http-token.interceptor';

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

  describe('when a HTTP call made', () => {
    it('should add proper authorization token', inject(
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

  describe('When a Lambda call returns an Invalid Request HTTP Response code', () => {
    let response: any;
    let errResponse: any;
    const httpResponseHeaders = {
      status: AppGlobalConstants.HttpErrorResponseCode.InvalidHttpRequest,
      statusText: 'Invalid Http Request'
    };
    const httpResponseBody =
      'Error: Http failure response for /fakecall: 400 Invalid Http Request';

    it('should return Invalid Response message', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );

        httpMock
          .expectOne('/fakecall')
          .flush(httpResponseBody, httpResponseHeaders);
        expect(errResponse).toBe(httpResponseBody);
      }
    ));
  });

  describe('When a Lambda call returns an Unauthorized Error HTTP Response code', () => {
    let response: any;
    let errResponse: any;
    const httpResponseHeaders = {
      status: AppGlobalConstants.HttpErrorResponseCode.UnauthorizedAccess,
      statusText: 'Unauthorized Http Request'
    };
    const httpResponseBody =
      'Error: Http failure response for /fakecall: 403 Unauthorized Http Request';

    it('should return Unauthorized Response message', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );

        httpMock
          .expectOne('/fakecall')
          .flush(httpResponseBody, httpResponseHeaders);
        expect(errResponse).toBe(httpResponseBody);
      }
    ));
  });

  describe('When a Lambda call returns an Timeout Error HTTP Response code', () => {
    let response: any;
    let errResponse: any;
    const httpResponseHeaders = {
      status: AppGlobalConstants.HttpErrorResponseCode.TimeOutErrorCode,
      statusText: 'Http Request Session Timeout'
    };
    const httpResponseBody =
      'Error: Http failure response for /fakecall: 401 Http Request Session Timeout';

    it('should return Timeout  Response message', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );

        httpMock
          .expectOne('/fakecall')
          .flush(httpResponseBody, httpResponseHeaders);
        expect(errResponse).toBeUndefined();
      }
    ));
  });

  describe('When a Lambda call returns an Internal Error HTTP Response code', () => {
    let response: any;
    let errResponse: any;
    const httpResponseHeaders = {
      status: AppGlobalConstants.HttpErrorResponseCode.InternalServerError,
      statusText: 'Failed due to Internal Error'
    };
    const httpResponseBody = `Error: ${appMessagesServiceStub.getMessage(
      AppMessage.ServerOperationError
    )}`;

    it('should return Internal Error Response message', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );

        httpMock
          .expectOne('/fakecall')
          .flush(httpResponseBody, httpResponseHeaders);
        expect(errResponse).toBe(httpResponseBody);
      }
    ));
  });

  describe('When a Lambda call returns an Error that supports standard error schema', () => {
    let response: any;
    let errResponse: any;
    const httpResponseHeaders = {
      status: AppGlobalConstants.HttpErrorResponseCode.REQUEST_SEMANTIC_ERROR,
      statusText: 'Failed due to Semantic Error'
    };
    const data = { errorDetail: 'Standard Error' };
    const httpResponseBody = JSON.stringify(data);
    it('should return the Standard Error message that comes from Lambda', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );
        httpMock
          .expectOne('/fakecall')
          .flush(httpResponseBody, httpResponseHeaders);
        expect(errResponse).toContain('Standard Error');
      }
    ));
  });

  describe('When a Lambda call returns an Error that implements Custom Error', () => {
    let response: any;
    let errResponse: any;
    const httpResponseHeaders = {
      status: AppGlobalConstants.HttpErrorResponseCode.REQUEST_SEMANTIC_ERROR,
      statusText: 'Failed due to Semantic Error'
    };
    const httpResponseBody = { body: { errorDetail: 'Custom Error' } };
    it('should return  the Custom Error message that comes from Lambda', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/fakecall').subscribe(
          res => (response = res),
          err => (errResponse = err)
        );
        httpMock
          .expectOne('/fakecall')
          .flush(httpResponseBody, httpResponseHeaders);
        console.log(errResponse);
        expect(errResponse).toContain('Custom Error');
      }
    ));
  });
});
