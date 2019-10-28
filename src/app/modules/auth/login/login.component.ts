import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from './../../../core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true; // #password

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationSVC: AuthenticationService
  ) { }

  ngOnInit() {
    console.log('Login Component -- ngOnInit');
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :  this.email.hasError('email') ? 'Not a valid email' : '';
  }

  clickLogin() {
    this.authenticationSVC.IsAuthenticated = true;

    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'.toString()];
    if (returnUrl === undefined) {
      this.router.navigate(['/announcements']);
    } else {
      this.router.navigate([returnUrl]);
    }
  }
}
