import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { RequestDetailService } from './request-detail.service';

describe('RequestDetailService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestDetailService]
    })
  );

  it('should create the component successfully', () => {
    const service: RequestDetailService = TestBed.get(RequestDetailService);
    expect(service).toBeTruthy();
  });

  it('should match property  getter value with setter value', () => {
    const service: RequestDetailService = TestBed.get(RequestDetailService);
    service.requestId = '89cfb46f-ff9c-d6a1-97fa-928a8839a8c7';
    expect(
      service.requestId === '89cfb46f-ff9c-d6a1-97fa-928a8839a8c7'
    ).toBeTruthy();
    expect(service).toBeTruthy();
  });

  it('should invoke the correct API-Gateway URL with correct paramters', () => {
    const service: RequestDetailService = TestBed.get(RequestDetailService);
    const testRequestId = '89cfb46f-ff9c-d6a1-97fa-928a8839a8c7';
    service.requestId = testRequestId;
    service.getRequestDetails();
    const requestURL = service.getEndPointURL(); // URL that needs to be verified against gold copy
    const goldCopy: string = environment.apiGateway.url;
    expect(requestURL.indexOf(goldCopy) >= 0).toBeTruthy(); //  matched with gold copy
    expect(requestURL.indexOf(testRequestId) >= 0).toBeTruthy(); // requestId found in URL
    service.requestId = '';
    expect(service.getEndPointURL().indexOf(testRequestId) < 0).toBeTruthy();
    expect(service).toBeTruthy();
  });

  it('should invoke the correct mock JSON for test data', () => {
    const service: RequestDetailService = TestBed.get(RequestDetailService);
    service.requestId = '89cfb46f-ff9c-d6a1-97fa-928a8839a8c7';
    service.isMock = true;
    service.getRequestDetails();
    const requestURL = service.getEndPointURL();
    expect(requestURL.indexOf('request-details.json') > 0).toBeTruthy();
    expect(service).toBeTruthy();
  });
});
