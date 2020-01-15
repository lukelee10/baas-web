import { Injectable } from '@angular/core';

export interface SelectItem {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class LookupStaticDataService {
  // TODO Eventually these values should come a lambda (i.e. getClassifications?)
  // this lambda dont exist yet but their creation and use is debt
  // and addressed eventually
  classificationTypesData: SelectItem[] = [
    { value: 'U', label: 'UNCLASSIFIED' },
    { value: 'U//FOUO', label: 'UNCLASSIFIED - For Official Use Only' },
    { value: 'U//LES', label: 'UNCLASSIFIED - Law Enforcement Sensitive' }
  ];

  // TODO Eventually these values should come a lambda (i.e. getModalities?)
  // this lambda dont exist yet but their creation and use is debt
  // and addressed eventually
  modalityTypesData: SelectItem[] = [
    { value: 'Face', label: 'Face' },
    { value: 'Iris', label: 'Iris' },
    { value: 'Fingerprint', label: 'Fingerprint' }
  ];

  allowedFileTypes = ['image/jpeg', 'image/png', 'image/jp2', 'image/bmp'];
}
