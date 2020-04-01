import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import { AppMessagesService } from 'src/app/core/services/app-messages.service';
import { UserPackageService } from 'src/app/core/services/user-package.service';
import {
  UserPackage,
  UserPackageResponse
} from 'src/app/shared/models/user-package';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SharedModule } from './../../../shared/shared.module';
import { PackageListComponent } from './package-list.component';

class MockUserPackageService extends UserPackageService {
  public getEndPointURL() {
    return '../../../assets/json/mock/baas-mock-packages-asc.json';
  }

  public getPackages(): Observable<UserPackageResponse> {
    const arr = {
      count: 10,
      lastItem: 'bEFjY2VzcyI6MSwiQ3JlYXRlZCI6IjIwMTktMTEtMDJUMjE6MzY6NTQifQ',
      packages: [
        {
          PackageId: '4b492006-9102-4aed-8f67-00f3a9f8f7c4',
          Created: '2020-02-07T13:13:13',
          Name: 'Lowball Package Submission',
          RequestCount: 2
        },
        {
          PackageId: '4b492006-9102-4aed-8f67-00f3a9f8f7c3',
          Created: '2020-02-07T13:13:13',
          Name: 'Hightop Package',
          RequestCount: 5
        }
      ]
    };

    return (of(arr) as unknown) as Observable<UserPackageResponse>;
  }
}

describe('PackageListComponent', () => {
  let component: PackageListComponent;
  let fixture: ComponentFixture<PackageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackageListComponent],
      imports: [
        CommonModule,
        FlexLayoutModule,
        SharedModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserPackageService, useClass: MockUserPackageService },
        NotificationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageListComponent);
    component = fixture.componentInstance;
    component.showSpinner = false;
  });

  it('Verify the component is created successfully', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Verify the service invocation and proper databinding', () => {
    fixture.detectChanges();
    expect(component.userPackages.length === 2).toBeTruthy();
  });

  it('Verify the sorting triggers new data binding occures again', () => {
    fixture.detectChanges();
    const arrSortOrderChange = {
      sortOrder: {
        previousValue: 'desc',
        currentValue: 'asc'
      }
    };
    const spyPrivateFunction = spyOn<any>(component, 'invokePackageService');
    component.ngOnChanges(arrSortOrderChange);
    // verify that invokePackageService is called when sort order changes
    // invokePackageService will get the databack from lambda for given sort order
    expect(spyPrivateFunction.calls.any()).toBeTruthy();
  });

  it('Verify Proper Trigger  of Package Click Event', () => {
    fixture.detectChanges();
    spyOn(component.eventOnPackageClick, 'emit');
    const userPackage: UserPackage = {
      PackageId: '4b492006-9102-4aed-8f67-00f3a9f8f7c4',
      Created: undefined,
      Name: undefined,
      RequestCount: undefined
    };

    component.packageClick(userPackage);
    expect(component.eventOnPackageClick.emit).toHaveBeenCalled();
    expect(component.eventOnPackageClick.emit).toHaveBeenCalledWith(
      userPackage
    );
  });

  it('Verify the Service Call Failure proper handling', () => {
    const userPackageService = fixture.debugElement.injector.get(
      UserPackageService
    );
    const mockCall = spyOn(userPackageService, 'getPackages').and.returnValue(
      // simulate the 404 error
      throwError({ status: 404 })
    );
    const mockAppMessagesService = fixture.debugElement.injector.get(
      AppMessagesService
    );
    const spymockAppMessagesService = spyOn(
      mockAppMessagesService,
      'getMessage'
    );
    fixture.detectChanges();
    // error in service should result zero packages
    expect(component.userPackages.length === 0).toBeTruthy();
    // AppMessagesService.getMessage must be invoked to display friendly error to user
    expect(spymockAppMessagesService.calls.any()).toBeTruthy();
  });
});
