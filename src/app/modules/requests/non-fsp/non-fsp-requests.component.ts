import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { requireCheckboxesToBeCheckedValidator } from '../../../shared/require-checkboxes-to-be-checked.validator';

@Component({
  selector: 'app-non-fsp-requests',
  templateUrl: './non-fsp-requests.component.html',
  styleUrls: ['./non-fsp-requests.component.scss']
})
export class NonFspRequestsComponent implements OnInit {
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
    // this.form.get('packageTitle').setValue('');
    //  console.log('packageTitle: ' + this.form.get('packageTitle').value);
  }
}

export class RequestsComponent implements OnInit {
  constructor() {}

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
