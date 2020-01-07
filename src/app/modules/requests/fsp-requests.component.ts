import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { requireCheckboxesToBeCheckedValidator } from '../../shared/require-checkboxes-to-be-checked.validator';

@Component({
  selector: 'app-fsp-requests',
  templateUrl: './fsp-requests.component.html',
  styleUrls: ['./non-fsp-requests.component.scss']
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
