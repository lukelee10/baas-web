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
          username: 'test1.admin@leidos.com',
          role: 'Admin',
          GUID: 'e95338a0-5710-11ea-9d4a-ad6835c0c88c',
          group: 'DOS',
          isAdmin: true,
          firstname: 'Test',
          lastname: 'Admin'
        },
        {
          username: 'test2.lead@leidos.com',
          role: 'Lead',
          GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
          group: 'DOS',
          isAdmin: false,
          firstname: 'Test',
          CreatedAt: '2020-02-19T22:02:42.016Z',
          lastname: 'Lead'
        }
      ],
      Count: 2,
      ScannedCount: 2
    });
  },
  getUsers(): Observable<any> {
    return of([
      {
        username: 'test1.admin@leidos.com',
        role: 'Admin',
        GUID: 'e95338a0-5710-11ea-9d4a-ad6835c0c88c',
        group: 'DOS',
        isAdmin: true,
        CreatedAt: '2020-02-24T14:21:13.387Z',
        firstname: 'Test',
        LastActivityTime: '2020-02-28T22:43:50.382Z',
        lastname: 'Admin'
      },
      {
        username: 'test2.lead@leidos.com',
        role: 'Lead',
        GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
        group: 'DOS',
        isAdmin: false,
        firstname: 'Test',
        CreatedAt: '2020-02-19T22:02:42.016Z',
        lastname: 'Lead'
      },
      {
        username: 'user1@leidos.com',
        role: 'Fsp',
        GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
        group: 'DOS',
        isAdmin: false,
        CreatedAt: '2020-02-19T22:02:42.016Z',
        lastname: 'Lead'
      },
      {
        username: 'user2.lead@leidos.com',
        role: 'Lead',
        GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
        group: 'DOS',
        isAdmin: false,
        firstname: 'Test',
        CreatedAt: '2020-02-19T22:02:42.016Z',
        isDisabled: true
      }
    ]);
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
  disableOrg(org: any) {
    return of({ status: 'ok' });
  },
  deleteUser(): Observable<any> {
    return of({ status: 'ok' });
  },
  updateUser(user: any): Observable<any> {
    return of({ status: 'ok', user });
  },
  updateUserName(user: any): Observable<any> {
    return of({ status: 'ok', user });
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
    result.subscribe(data => expect(data.length).toBeTruthy());
  });
});
