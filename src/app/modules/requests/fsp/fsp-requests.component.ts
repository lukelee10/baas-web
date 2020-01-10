import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fsp-requests',
  templateUrl: './fsp-requests.component.html'
})
export class FspRequestsComponent implements OnInit {
  form = new FormGroup({
    packageTitle: new FormControl('', Validators.required)
  });

  constructor() {}

  ngOnInit() {}
}
