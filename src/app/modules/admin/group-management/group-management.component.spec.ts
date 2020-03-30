import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTreeModule
} from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import { UserRoles } from 'src/app/core/app-global-constants';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { UserService } from 'src/app/core/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import {
  GroupFlatNode,
  GroupManagementComponent
} from './group-management.component';

// Mock the SortService class, its method and return it with mock data
class MockUserService extends UserService {
  get Role(): string {
    return UserRoles.NonFSPUser;
  }
  get UserId(): string {
    return 'admin@baas.devver1';
  }
  get Group(): string {
    return 'DEFAULT';
  }
}

export class MdDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open() {
    return {
      afterClosed: () => of('New Group')
    };
  }
}

export const AwsLambdaServiceMock: Partial<AwsLambdaService> = {
  getUsersInGroup(groupName: string): Observable<any> {
    return of({
      Items: [
        {
          UserId: 'test1@test.gov',
          Role: 'Admin',
          GUID: 'e95338a0-5710-11ea-9d4a-ad6835c0c88c',
          Group: 'DOS',
          IsAdmin: true,
          CreatedAt: '2020-02-24T14:21:13.387Z',
          Firstname: 'test',
          LastActivityTime: '2020-02-28T22:43:50.382Z',
          Lastname: 'last'
        },
        {
          UserId: 'test2@test.gov',
          Role: 'Lead',
          GUID: '8cf81e00-5363-11ea-b0e8-fbab61f36838',
          Group: 'DOS',
          IsAdmin: false,
          Firstname: 'test2',
          CreatedAt: '2020-02-19T22:02:42.016Z',
          Lastname: 'last'
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
      ConsumedCapacity: { TableName: 'BaasLukeOrganization', CapacityUnits: 2 }
    });
  },
  createOrg(newOrg): Observable<any> {
    return newOrg.org.name.includes('kaput')
      ? throwError({ status: 404 })
      : of({ status: 'ok' });
  }
};

let notificationSuccess = 0;
let notificationError = 0;
const notificationServiceStub: Partial<NotificationService> = {
  setPopUpTitle(title: string) {},
  notify(title: string): MatSnackBarRef<any> {
    return null;
  },
  successful(msg: string) {
    console.log('notification service success!!!');
    notificationSuccess++;
  },
  error(msg: string) {
    notificationError++;
  }
};

describe('====GroupManagementComponent', () => {
  let groupComponent: GroupManagementComponent;
  let groupFixture: ComponentFixture<GroupManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        HttpClientTestingModule
      ],
      declarations: [GroupManagementComponent],
      providers: [
        { provide: NotificationService, useValue: notificationServiceStub },
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock },
        { provide: UserService, useClass: MockUserService },
        { provide: MatDialog, useClass: MdDialogMock }
      ]
    })
      .compileComponents()
      .then(() => {
        groupFixture = TestBed.createComponent(GroupManagementComponent);
        groupComponent = groupFixture.componentInstance;
        groupFixture.detectChanges();
      });
  }));

  beforeEach(() => {
    groupFixture = TestBed.createComponent(GroupManagementComponent);
    groupComponent = groupFixture.componentInstance;
    groupFixture.detectChanges();
  });

  it('should show tree', done => {
    expect(groupComponent).toBeTruthy();
    const orgs = groupFixture.debugElement.nativeElement.querySelectorAll(
      'mat-tree-node'
    );
    expect(orgs.length).toEqual(3);
    done();
  });

  it('should add an org correctly using askGroupNameAndAddRoot', done => {
    const de: TemplateRef<any> = (groupFixture.debugElement.query(
      By.css('#solicitGroupName')
    ) as unknown) as TemplateRef<any>;
    groupComponent.askGroupNameAndAddRoot(de);

    expect(groupComponent).toBeTruthy();

    done();
  });

  it('should show error when createOrg fails on add an org', done => {
    const mockAwsLambdaService = groupFixture.debugElement.injector.get(
      AwsLambdaService
    );

    const mockAwsLambdaServiceCall = spyOn(
      mockAwsLambdaService,
      'createOrg'
    ).and.returnValue(
      // simulate the 404 error
      throwError({ status: 404 })
    );
    const de: TemplateRef<any> = (groupFixture.debugElement.query(
      By.css('#solicitGroupName')
    ) as unknown) as TemplateRef<any>;
    const mockNotificationService = groupFixture.debugElement.injector.get(
      NotificationService
    );
    const spyService = spyOn(mockNotificationService, 'error');
    groupComponent.askGroupNameAndAddRoot(de);

    expect(groupComponent).toBeTruthy();
    expect(spyService.calls.any()).toBeTruthy();

    done();
  });

  it('should add a group correctly using askGroupNameAndAddToNode', done => {
    const de: TemplateRef<any> = (groupFixture.debugElement.query(
      By.css('#solicitGroupName')
    ) as unknown) as TemplateRef<any>;
    const testNode: GroupFlatNode = {
      item: 'Test-Item',
      level: 0,
      expandable: false,
      fqn: 'ABC/leaf1'
    };
    groupComponent.flatNodeMap.set(testNode, testNode);
    const mockNotificationService = groupFixture.debugElement.injector.get(
      NotificationService
    );
    const spyService = spyOn(mockNotificationService, 'successful');
    groupComponent.askGroupNameAndAddToNode(de, testNode);
    expect(groupComponent).toBeTruthy();
    expect(spyService.calls.any()).toBeTruthy();
    done();
  });

  it('should show error screen when createOrg fails on adding a group', done => {
    const mockAwsLambdaService = groupFixture.debugElement.injector.get(
      AwsLambdaService
    );

    const mockAwsLambdaServiceCall = spyOn(
      mockAwsLambdaService,
      'createOrg'
    ).and.returnValue(
      // simulate the 404 error
      throwError({ status: 404 })
    );

    const de: TemplateRef<any> = (groupFixture.debugElement.query(
      By.css('#solicitGroupName')
    ) as unknown) as TemplateRef<any>;
    const testNode: GroupFlatNode = {
      item: 'Test-Item',
      level: 0,
      expandable: false,
      fqn: 'ABC/leaf1'
    };
    groupComponent.flatNodeMap.set(testNode, testNode);
    const mockNotificationService = groupFixture.debugElement.injector.get(
      NotificationService
    );
    const spyService = spyOn(mockNotificationService, 'error');
    groupComponent.askGroupNameAndAddToNode(de, testNode);
    expect(groupComponent).toBeTruthy();
    expect(spyService.calls.any()).toBeTruthy();
    expect(mockAwsLambdaServiceCall).toHaveBeenCalled();
    done();
  });

  it('should not call newOrg lambda function when user did not enter data', done => {
    const mockAwsLambdaService = groupFixture.debugElement.injector.get(
      AwsLambdaService
    );

    const mockAwsLambdaServiceCall = spyOn(
      mockAwsLambdaService,
      'createOrg'
    ).and.returnValue(
      // simulate the 404 error
      throwError({ status: 404 })
    );

    const dialogRefMock = TestBed.get(MatDialog);
    const returnedVal = {
      afterClosed: () => of(null)
    };

    spyOn(dialogRefMock, 'open').and.returnValue(returnedVal);
    const de: TemplateRef<any> = (groupFixture.debugElement.query(
      By.css('#solicitGroupName')
    ) as unknown) as TemplateRef<any>;
    const testNode: GroupFlatNode = {
      item: 'Test-Item',
      level: 0,
      expandable: false,
      fqn: 'ABC/leaf1'
    };
    groupComponent.flatNodeMap.set(testNode, testNode);
    const mockNotificationService = groupFixture.debugElement.injector.get(
      NotificationService
    );
    const spyService = spyOn(mockNotificationService, 'error');
    groupComponent.askGroupNameAndAddToNode(de, testNode);
    expect(groupComponent).toBeTruthy();
    expect(mockAwsLambdaServiceCall).not.toHaveBeenCalled();
    expect(spyService.calls.any()).toBeFalsy();
    done();
  });
});
