import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  public selectedProviders: Provider[] = [];
  @Output() eventOnProvidersSelection = new EventEmitter();
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

  isValidForm(): boolean {
    const formArray = this.formProviders.get('providerControls') as FormArray;
    let checked = 0;
    let index = 0;
    this.selectedProviders = [];
    Object.keys(formArray.controls).forEach(key => {
      const control = formArray.controls[key];
      if (control.value === true) {
        checked++;
        this.selectedProviders.push(this.providersViewModel[index]);
      }
      index++;
    });
    if (checked >= this.minRequired) {
      return true;
    }
    return false;
  }

  toggleAllSelection() {
    const formArray = this.formProviders.get('providerControls') as FormArray;
    Object.keys(formArray.controls).forEach(key => {
      const control = formArray.controls[key];
      control.value = control.value ? false : true;
    });
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

  private createProviderCheckBoxes() {
    const arr = this.providersViewModel.map(provider => {
      const fc = new FormControl(false);

      return fc;
    });
    return new FormArray(arr);
  }

  private subscribeStatusChanges() {
    this.formProviders.controls.providerControls.statusChanges.subscribe(
      s => {
        const fArr = this.formProviders.get('providerControls') as FormArray;
        this.showFooter = this.isValidForm() ? false : true;
        this.eventOnProvidersSelection.emit(this.selectedProviders);
      },
      e => {
        this.notificationService.debugLogging(e);
      },
      () => {
        this.notificationService.debugLogging('complete');
      }
    );
  }
}
