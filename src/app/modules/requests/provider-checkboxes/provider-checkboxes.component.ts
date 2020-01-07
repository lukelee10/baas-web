import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { Provider } from '../../../shared/models/provider';

@Component({
  selector: 'app-provider-checkboxes',
  templateUrl: './provider-checkboxes.component.html',
  styleUrls: ['./provider-checkboxes.component.scss']
})
export class ProviderCheckboxesComponent implements OnInit {
  public providersViewModel: Provider[] = [];
  formProviders: FormGroup;
  minRequired = 1;
  showFooter = true;
  constructor(
    private awsLambdaService: AwsLambdaService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getProviders();
    this.notificationService.debugLogging(this.providersViewModel);
  }

  getProviders(): void {
    this.awsLambdaService.getProviders().subscribe(
      providers => {
        this.getViewModelProviders(providers);
        this.formProviders = new FormGroup({
          providerControls: this.createProviderCheckBoxes()
        });
        this.subscribeStatusChanges();
      },
      error => {
        this.notificationService.debugLogging(error);
      }
    );
  }

  private isValidForm(formArray: FormArray) {
    let checked = 0;
    Object.keys(formArray.controls).forEach(key => {
      const control = formArray.controls[key];
      if (control.value === true) {
        checked++;
      }
    });
    if (checked >= this.minRequired) {
      return true;
    }
    return false;
  }

  private subscribeStatusChanges() {
    this.formProviders.controls.providerControls.statusChanges.subscribe(
      s => {
        const fArr = this.formProviders.get('providerControls') as FormArray;
        this.showFooter = this.isValidForm(fArr) ? false : true;
      },
      e => {
        this.notificationService.debugLogging(e);
      },
      () => {
        this.notificationService.debugLogging('complete');
      }
    );
  }

  private getViewModelProviders(providers: any): void {
    for (const item of providers.Items) {
      this.providersViewModel.push({
        ProviderId: item.ProviderId,
        AdapterId: item.AdapterId,
        Description: item.Description
      });
    }
  }

  createProviderCheckBoxes() {
    const arr = this.providersViewModel.map(provider => {
      return new FormControl(false);
    });
    return new FormArray(arr);
  }
}
