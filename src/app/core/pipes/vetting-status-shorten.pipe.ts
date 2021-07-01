import { Pipe, PipeTransform } from '@angular/core';

import { RequestStatusFlags } from '../app-global-constants';

@Pipe({
  name: 'vettingStatusShorten'
})
export class VettingStatusShortenPipe implements PipeTransform {
  transform(value: string): string {
    const inputStatus = value !== undefined ? value.toUpperCase().trim() : '';
    let newStr = '';
    switch (inputStatus) {
      case 'PENDING':
        newStr = RequestStatusFlags.Pending;
        break;
      case 'INVESTIGATIVE LEAD':
        newStr = RequestStatusFlags.InvestigativeLead;
        break;
      case 'RED':
        newStr = RequestStatusFlags.InvestigativeLead;
        break;
      case 'GREEN':
        newStr = RequestStatusFlags.NoLead;
        break;
      case 'NO LEAD':
        newStr = RequestStatusFlags.NoLead;
        break;
      case 'ERROR':
        newStr = RequestStatusFlags.Error;
        break;
      case '':
        newStr = RequestStatusFlags.EmptyString;
        break;
      default:
        newStr = inputStatus.substr(0, 3);
    }

    return newStr;
  }
}

@Pipe({
  name: 'vettingStatusPipe'
})
export class VettingStatusPipe implements PipeTransform {
  transform(value: string): string {
    const inputStatus = value !== undefined ? value.toUpperCase().trim() : '';
    let newStr = '';
    switch (inputStatus) {
      case 'RED':
        newStr = 'INVESTIGATIVE LEAD';
        break;
      case 'GREEN':
        newStr = 'NO LEAD';
        break;
      default:
        newStr = inputStatus;
    }

    return newStr;
  }
}
