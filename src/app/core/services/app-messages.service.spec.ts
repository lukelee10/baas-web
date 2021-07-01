import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppMessage, AppMessagesService } from './app-messages.service';

describe('AppMessagesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppMessagesService]
    })
  );

  it('should create the component successfully', () => {
    const service: AppMessagesService = TestBed.get(AppMessagesService);
    expect(service).toBeTruthy();
  });

  it('should return a valid message for given message-code ', () => {
    const service: AppMessagesService = TestBed.get(AppMessagesService);
    const sessionTimeoutMessage = AppMessage.SessionTimeOut;
    expect(service).toBeTruthy();
    expect(
      service
        .getMessage(sessionTimeoutMessage)
        .indexOf('Your session has expired') >= 0
    ).toBeTruthy();
  });

  it('should return a valid title for given message-code ', () => {
    const service: AppMessagesService = TestBed.get(AppMessagesService);
    const sessionTimeoutMessage = AppMessage.SessionTimeOut;
    expect(service).toBeTruthy();
    expect(
      service.getTitle(sessionTimeoutMessage).indexOf('Session Timeout') >= 0
    ).toBeTruthy();
  });
});
