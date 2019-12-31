import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
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
