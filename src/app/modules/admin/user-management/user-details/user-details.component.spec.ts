import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { GroupManagementComponent } from '../../group-management/group-management.component';
import { AwsLambdaServiceMock } from '../../group-management/group-management.component.spec';
import { UserDetailsComponent } from './user-details.component';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  const dialogMock = {
    close: () => {}
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        SharedModule,
        MatInputModule
      ],
      declarations: [UserDetailsComponent, GroupManagementComponent],
      providers: [
        { provide: AwsLambdaService, useValue: AwsLambdaServiceMock },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setGroup', () => {
    const gNode = { item: 'ABC', level: 0, expandable: true, fqn: 'ABC' };
    component.setGroup(gNode);
    expect(component.form.get('group').value).toEqual('ABC');
  });
});
