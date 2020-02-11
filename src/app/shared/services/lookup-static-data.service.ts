import { Injectable } from '@angular/core';

export interface SelectItem {
  value: string;
  label: string;
  tooltip: string;
}

@Injectable({
  providedIn: 'root'
})
export class LookupStaticDataService {
  // TODO Eventually these values should come a lambda (i.e. getClassifications?)
  // this lambda don't exist yet but their creation and use is debt
  // and addressed eventually
  classificationTypesData: SelectItem[] = [
    { value: 'U', label: 'UNCLASSIFIED', tooltip: 'UNCLASSIFIED' },
    {
      value: 'U//FOUO',
      label: 'U//FOUO',
      tooltip: 'UNCLASSIFIED - For Official Use Only'
    },
    {
      value: 'U//LES',
      label: 'U//LES',
      tooltip: 'UNCLASSIFIED - Law Enforcement Sensitive'
    }
  ];

  // TODO Eventually these values should come a lambda (i.e. getModalities?)
  // this lambda don't exist yet but their creation and use is debt
  // and addressed eventually
  modalityTypesData: SelectItem[] = [
    { value: 'Face', label: 'Face', tooltip: 'Face' }
  ];

  allowedFileTypes = ['image/jpeg', 'image/png', 'image/jp2', 'image/bmp'];
}
