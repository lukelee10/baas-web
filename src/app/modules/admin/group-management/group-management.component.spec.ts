import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { UserRoles } from 'src/app/core/app-global-constants';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { AwsLambdaServiceMock } from 'src/app/core/services/aws-lambda.service.spec';
import { UserService } from 'src/app/core/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';

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
      imports: [BrowserAnimationsModule, SharedModule, HttpClientTestingModule],
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

  describe('When main functions invoked', () => {
    beforeEach(() => {
      groupFixture = TestBed.createComponent(GroupManagementComponent);
      groupComponent = groupFixture.componentInstance;
      groupFixture.detectChanges();
    });

    it('should add an org correctly using askGroupNameAndAddRoot', done => {
      const de: TemplateRef<any> = (groupFixture.debugElement.query(
        By.css('#solicitGroupName')
      ) as unknown) as TemplateRef<any>;
      groupComponent.askGroupNameAndAddRoot(de);

      expect(groupComponent).toBeTruthy();

      done();
    });

    it('should not add an org using askGroupNameAndAddRoot when user did not enter name', done => {
      const dialogRefMock = TestBed.get(MatDialog);
      const returnedVal = { afterClosed: () => of(null) };
      spyOn(dialogRefMock, 'open').and.returnValue(returnedVal);
      const de: TemplateRef<any> = (groupFixture.debugElement.query(
        By.css('#solicitGroupName')
      ) as unknown) as TemplateRef<any>;
      groupComponent.askGroupNameAndAddRoot(de);

      expect(groupComponent).toBeTruthy();

      done();
    });

    it('should show error using askGroupNameAndAddRoot when createOrg fails on add an org', done => {
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

    it('should rename an org correctly using askGroupNameAndRenameNode', done => {
      const de: TemplateRef<any> = (groupFixture.debugElement.query(
        By.css('#solicitEditedGroupName')
      ) as unknown) as TemplateRef<any>;
      const testNode: GroupFlatNode = {
        item: 'Test-Item',
        level: 0,
        expandable: false,
        fqn: 'ABC/leaf1',
        disabled: false
      };

      groupComponent.askGroupNameAndRenameNode(de, testNode);

      expect(groupComponent).toBeTruthy();

      done();
    });
    it('should show error when updateOrg fails on rename an org', done => {
      const mockAwsLambdaService = groupFixture.debugElement.injector.get(
        AwsLambdaService
      );
      const testNode: GroupFlatNode = {
        item: 'Test-Item',
        level: 0,
        expandable: false,
        fqn: 'ABC/leaf1',
        disabled: false
      };
      const mockAwsLambdaServiceCall = spyOn(
        mockAwsLambdaService,
        'updateOrg'
      ).and.returnValue(
        // simulate the 404 error
        throwError({ status: 404 })
      );
      const de: TemplateRef<any> = (groupFixture.debugElement.query(
        By.css('#solicitEditedGroupName')
      ) as unknown) as TemplateRef<any>;
      const mockNotificationService = groupFixture.debugElement.injector.get(
        NotificationService
      );
      const spyService = spyOn(mockNotificationService, 'error');
      groupComponent.askGroupNameAndRenameNode(de, testNode);

      expect(groupComponent).toBeTruthy();
      expect(spyService.calls.any()).toBeTruthy();

      done();
    });

    it('should rename a group correctly using askGroupNameAndRenameNode', done => {
      const de: TemplateRef<any> = (groupFixture.debugElement.query(
        By.css('#solicitEditedGroupName')
      ) as unknown) as TemplateRef<any>;
      const testNode: GroupFlatNode = {
        item: 'Test-Item',
        level: 0,
        expandable: false,
        fqn: 'ABC/leaf1',
        disabled: false
      };
      groupComponent.flatNodeMap.set(testNode, testNode);
      const mockNotificationService = groupFixture.debugElement.injector.get(
        NotificationService
      );
      const spyService = spyOn(mockNotificationService, 'successful');
      groupComponent.askGroupNameAndRenameNode(de, testNode);
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
        fqn: 'ABC/leaf1',
        disabled: false
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
        fqn: 'ABC/leaf1',
        disabled: false
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
      const returnedVal = { afterClosed: () => of(null) };

      spyOn(dialogRefMock, 'open').and.returnValue(returnedVal);
      const de: TemplateRef<any> = (groupFixture.debugElement.query(
        By.css('#solicitGroupName')
      ) as unknown) as TemplateRef<any>;
      const testNode: GroupFlatNode = {
        item: 'Test-Item',
        level: 0,
        expandable: false,
        fqn: 'ABC/leaf1',
        disabled: false
      };
      groupComponent.flatNodeMap.set(testNode, testNode);
      const mockNotificationService = groupFixture.debugElement.injector.get(
        NotificationService
      );
      const spyService = spyOn(mockNotificationService, 'error');
      groupComponent.askGroupNameAndAddToNode(de, testNode);
      expect(mockAwsLambdaServiceCall).not.toHaveBeenCalled();
      expect(spyService.calls.any()).toBeFalsy();
      done();
    });

    it('should select a group using selectNode', done => {
      groupComponent.selectNode(new GroupFlatNode());
      expect(groupComponent).toBeTruthy();
      done();
    });
  });

  it('should not call updateOrg lambda function when user did not enter data', done => {
    const mockAwsLambdaService = groupFixture.debugElement.injector.get(
      AwsLambdaService
    );

    const mockAwsLambdaServiceCall = spyOn(
      mockAwsLambdaService,
      'updateOrg'
    ).and.returnValue(
      // simulate the 404 error
      throwError({ status: 404 })
    );

    const dialogRefMock = TestBed.get(MatDialog);
    const returnedVal = { afterClosed: () => of(null) };
    spyOn(dialogRefMock, 'open').and.returnValue(returnedVal);
    const de: TemplateRef<any> = (groupFixture.debugElement.query(
      By.css('#solicitEditedGroupName')
    ) as unknown) as TemplateRef<any>;
    const testNode: GroupFlatNode = {
      item: 'Test-Item',
      level: 0,
      expandable: false,
      fqn: 'ABC/leaf1',
      disabled: false
    };
    groupComponent.flatNodeMap.set(testNode, testNode);
    const mockNotificationService = groupFixture.debugElement.injector.get(
      NotificationService
    );
    const spyService = spyOn(mockNotificationService, 'error');
    groupComponent.askGroupNameAndAddToNode(de, testNode);
    expect(mockAwsLambdaServiceCall).not.toHaveBeenCalled();
    expect(spyService.calls.any()).toBeFalsy();
    done();
  });

  describe('When Service Lambda - disableOrg functions normally', () => {
    let testNode: GroupFlatNode;

    let spyNotificationService;
    beforeEach(() => {
      groupFixture = TestBed.createComponent(GroupManagementComponent);
      groupComponent = groupFixture.componentInstance;
      groupFixture.detectChanges();
      const mockNotificationService = groupFixture.debugElement.injector.get(
        NotificationService
      );
      spyNotificationService = spyOn(mockNotificationService, 'error');
      testNode = {
        item: 'Group-To-Disable',
        level: 0,
        expandable: false,
        fqn: 'ABC/leaf1',
        disabled: false
      };
    });

    it(`should correctly disable`, done => {
      const componentDebug = groupFixture.debugElement;
      const slider = (componentDebug.query(
        By.directive(MatSlideToggle)
      ) as unknown) as MatSlideToggle;
      const sliderChangeEvent = new MatSlideToggleChange(slider, true);
      groupComponent.toggleDisable(sliderChangeEvent, testNode);
      expect(spyNotificationService.calls.any()).toBeFalsy();
      done();
    });

    it(`should correctly enable`, done => {
      const componentDebug = groupFixture.debugElement;
      const slider = (componentDebug.query(
        By.directive(MatSlideToggle)
      ) as unknown) as MatSlideToggle;
      const sliderChangeEvent = new MatSlideToggleChange(slider, false);
      groupComponent.toggleDisable(sliderChangeEvent, testNode);
      expect(spyNotificationService.calls.any()).toBeFalsy();
      done();
    });
    it('should not have called labdaservice.disableOrg as user does not confirm', () => {
      const dialogRefMock = TestBed.get(MatDialog);
      const returnedVal = { afterClosed: () => of(null) };
      spyOn(dialogRefMock, 'open').and.returnValue(returnedVal);
      const slider = (groupFixture.debugElement.query(
        By.directive(MatSlideToggle)
      ) as unknown) as MatSlideToggle;
      const sEvent = new MatSlideToggleChange(slider, true);
      // TODO why is the Slider not visible along with the rest of the widgets
      // See the debugger mode
      // sEvent.source = {checked: false};
      groupComponent.toggleDisable(sEvent, testNode);
      expect(spyNotificationService.calls.any()).toBeFalsy();
    });
  });
  // test toggleDisable when Lambda Service disableOrg failes
  describe('When Service Lambda - disableOrg functions fails', () => {
    let mockAwsLambdaService;
    let mockAwsLambdaServiceCall;
    let testNode: GroupFlatNode;

    let spyNotificationService;
    beforeEach(() => {
      groupFixture = TestBed.createComponent(GroupManagementComponent);
      groupComponent = groupFixture.componentInstance;
      groupFixture.detectChanges();
      mockAwsLambdaService = groupFixture.debugElement.injector.get(
        AwsLambdaService
      );
      const mockNotificationService = groupFixture.debugElement.injector.get(
        NotificationService
      );
      spyNotificationService = spyOn(mockNotificationService, 'error');
      mockAwsLambdaServiceCall = spyOn(
        mockAwsLambdaService,
        'disableOrg'
      ).and.returnValue(
        // simulate the 404 error
        throwError({ status: 404 })
      );
      testNode = {
        item: 'Group-To-Disable',
        level: 0,
        expandable: false,
        fqn: 'ABC/leaf1',
        disabled: false
      };
    });

    it(`should  handle the exception`, done => {
      const componentDebug = groupFixture.debugElement;
      const slider = (componentDebug.query(
        By.directive(MatSlideToggle)
      ) as unknown) as MatSlideToggle;
      const sliderChangeEvent: MatSlideToggleChange = new MatSlideToggleChange(
        slider,
        true
      );
      groupComponent.toggleDisable(sliderChangeEvent, testNode);
      expect(spyNotificationService.calls.any()).toBeTruthy();
      done();
    });

    it(`should  handle the exception`, done => {
      const componentDebug = groupFixture.debugElement;
      const slider = (componentDebug.query(
        By.directive(MatSlideToggle)
      ) as unknown) as MatSlideToggle;
      const sliderChangeEvent: MatSlideToggleChange = new MatSlideToggleChange(
        slider,
        false
      );
      groupComponent.toggleDisable(sliderChangeEvent, testNode);
      expect(spyNotificationService.calls.any()).toBeTruthy();
      done();
    });
  });
});
