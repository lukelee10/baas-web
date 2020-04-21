import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { AwsLambdaService } from './aws-lambda.service';

export const AwsLambdaServiceMock: Partial<AwsLambdaService> = {
  // TODO need to switch to getUsers modified lambda function once it
  // recognized user's role
  getUsersInGroup(groupName: string): Observable<any> {
    return of({
      Items: [
        {
          UserId: 'test1.admin@leidos.com',
          Role: 'Admin',
          GUID: 'e95338a0-5710-11ea-9d4a-ad6835c0c88c',
          Group: 'DOS',
          IsAdmin: true,
          CreatedAt: '2020-02-24T14:21:13.387Z',
          Firstname: 'Test',
          LastActivityTime: '2020-02-28T22:43:50.382Z',
          Lastname: 'Admin'
        },
        {
          UserId: 'test2.lead@leidos.com',
          Role: 'Lead',
          GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
          Group: 'DOS',
          IsAdmin: false,
          Firstname: 'Test',
          CreatedAt: '2020-02-19T22:02:42.016Z',
          Lastname: 'Lead'
        }
      ],
      Count: 2,
      ScannedCount: 2
    });
  },
  getUsers(): Observable<any> {
    return of({
      Items: [
        {
          UserId: 'test1.admin@leidos.com',
          Role: 'Admin',
          GUID: 'e95338a0-5710-11ea-9d4a-ad6835c0c88c',
          Group: 'DOS',
          IsAdmin: true,
          CreatedAt: '2020-02-24T14:21:13.387Z',
          Firstname: 'Test',
          LastActivityTime: '2020-02-28T22:43:50.382Z',
          Lastname: 'Admin'
        },
        {
          UserId: 'test2.lead@leidos.com',
          Role: 'Lead',
          GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
          Group: 'DOS',
          IsAdmin: false,
          Firstname: 'Test',
          CreatedAt: '2020-02-19T22:02:42.016Z',
          Lastname: 'Lead'
        },
        {
          UserId: 'user1@leidos.com',
          Role: 'Fsp',
          GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
          Group: 'DOS',
          IsAdmin: false,
          CreatedAt: '2020-02-19T22:02:42.016Z',
          Lastname: 'Lead'
        },
        {
          UserId: 'user2.lead@leidos.com',
          Role: 'Lead',
          GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
          Group: 'DOS',
          IsAdmin: false,
          Firstname: 'Test',
          CreatedAt: '2020-02-19T22:02:42.016Z'
        }
      ],
      Count: 2,
      ScannedCount: 2
    });
  },
  getOrgs(): Observable<any> {
    return of({
      Items: [
        { OrgId: 'Europe', Parent: 'DOS' },
        { OrgId: 'France Embassy', Parent: 'Europe' },
        { OrgId: 'Chili Embassy', Parent: 'South America' },
        { OrgId: 'GB', Parent: 'Europe' },
        { OrgId: 'Brazil Embassy', Parent: 'South America' },
        { OrgId: 'Glasgow', Parent: 'GB' },
        { OrgId: 'Gang', CreatedAt: '2020-02-29T00:09:00.290Z' },
        { OrgId: 'London', Parent: 'GB' },
        { OrgId: 'South America', Parent: 'DOS' },
        { OrgId: 'NCIS' },
        { OrgId: 'Springfield, VA', Parent: 'NCIS' },
        {
          OrgId: 'Berlin office',
          Parent: 'German Embassy',
          CreatedAt: '2020-02-29T00:08:41.031Z'
        },
        { OrgId: 'DOS' },
        {
          OrgId: 'German Embassy',
          Parent: 'Europe',
          CreatedAt: '2020-02-29T00:01:56.790Z'
        }
      ],
      Count: 14,
      ScannedCount: 14,
      ConsumedCapacity: { TableName: 'SomeOrganization', CapacityUnits: 2 }
    });
  },
  createOrg(newOrg): Observable<any> {
    console.log('--------------------', newOrg.org);
    return newOrg.org.name.includes('kaput')
      ? throwError({ status: 404 })
      : of({ status: 'ok' });
  },
  deleteUser(): Observable<any> {
    return of({ status: 'ok' });
  },
  updateUser(user: any): Observable<any> {
    return of({ status: 'ok' });
  }
};

describe('AwsLambdaService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AwsLambdaService]
    })
  );

  it('should create the component successfully', () => {
    const service: AwsLambdaService = TestBed.get(AwsLambdaService);
    expect(service).toBeTruthy();
  });

  it('should invoke the correct API-Gateway URL with correct paramters', () => {
    const service: AwsLambdaService = TestBed.get(AwsLambdaService);
    const result = service.getUsers();
    result.subscribe(data => expect(data.Items).toBeTruthy());
  });
});
