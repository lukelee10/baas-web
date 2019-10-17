import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/_core/services/notification.service';


@Component({
  selector: 'app-testpage',
  templateUrl: './testpage.component.html',
  styleUrls: ['./testpage.component.scss']
})
export class TestpageComponent implements OnInit {
  profileForm: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.email ]),
    phone: new FormControl('', [ Validators.min(10) ]),
    fname: new FormControl('', [ Validators.min(2) ]),
    lname: new FormControl('', [ Validators.min(2) ])
  });

  get emailInput() { return this.profileForm.get('email'); }
  get fnameInput() { return this.profileForm.get('fname'); }
  get lnameInput() { return this.profileForm.get('lname'); }
  get phoneInput() { return this.profileForm.get('phone'); }

  constructor(
    private notificationSvc: NotificationService
  ) { }

  ngOnInit() {
  }


  getEmailInputError() {
    if (this.emailInput.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    if (this.emailInput.hasError('required')) {
      return 'An Email is required.';
    }
  }

  clickTest() {
    this.notificationSvc.show('Your profile information has been updated.');
  }
}
