import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { requireCheckboxesToBeCheckedValidator } from '../../../shared/require-checkboxes-to-be-checked.validator';

@Component({
  selector: 'app-fsp-requests',
  templateUrl: './fsp-requests.component.html'
})
export class FspRequestsComponent implements OnInit {
  form = new FormGroup({
    packageTitle: new FormControl('', Validators.required),
    selectClassification: new FormControl('', Validators.required),
    vettingCheckBoxGroup: new FormGroup(
      {
        vettingLowBall: new FormControl(false),
        vetting3LA: new FormControl(false),
        vettingABIS: new FormControl(false),
        vettingHIGHTOP: new FormControl(false)
      },
      requireCheckboxesToBeCheckedValidator()
    )
  });

  constructor() {}

  ngOnInit() {
    this.form.get('packageTitle').setValue('');
    console.log('packageTitle: ' + this.form.get('packageTitle').value);
  }
}

export class RequestsComponent implements OnInit {
  constructor() {}

  classifications: classification[] = [
    { value: 'U-0', viewValue: 'U' },
    { value: 'U//FOUO-1', viewValue: 'U//FOUO' },
    { value: 'U//LES-2', viewValue: 'Fingerprint' }
  ];

  @Input() httpRequestHeaders:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      } = new HttpHeaders()
    .set('sampleHeader', 'headerValue')
    .set('sampleHeader1', 'headerValue1');

  @Input()
  httpRequestParams:
    | HttpParams
    | {
        [param: string]: string | string[];
      } = new HttpParams()
    .set('sampleRequestParam', 'requestValue')
    .set('sampleRequestParam1', 'requestValue1');

  ngOnInit() {}

  public uploadEvent($event: any) {
    console.log('from client' + JSON.stringify($event));
  }
}

interface classification {
  value: string;
  viewValue: string;
}
