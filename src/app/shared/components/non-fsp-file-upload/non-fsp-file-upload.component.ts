import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-non-fsp-file-upload',
  templateUrl: './non-fsp-file-upload.component.html',
  styleUrls: ['./non-fsp-file-upload.component.scss']
})
export class NonFspFileUploadComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('Amuir is in NonFspFileUploadComponent');
  }
}
