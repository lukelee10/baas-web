import { Component, OnInit } from '@angular/core'
import { FormControl, ValidatorFn, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AppGlobalConstants } from 'src/app/core/app-global-constants'
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service'

import { LoaderService } from './../../../shared/services/loader.service'
import { NotificationService } from './../../../shared/services/notification.service'

// At least 1 special characters: `~!@#$%^&*()_+-={}|[]\:";'<>?,./
const validateSpecialChar: ValidatorFn = (c: FormControl) => {
  const ascii = c.value.split('').map(ch => ch.charCodeAt())
  const specialRange = [
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    91,
    92,
    93,
    94,
    95,
    96,
    123,
    124,
    125,
    126,
  ]
  const bag = ascii.filter(ch => specialRange.includes(ch))
  return bag.length >= 1 ? null : { validateSpecialChar: true }
}
const validateAlphaNumeric: ValidatorFn = (c: FormControl) => {
  return /((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9]))/.test(c.value)
    ? null
    : { validateAlphaNumeric: true }
}

const validateNo3Duplicate: ValidatorFn = (c: FormControl) => {
  return /(\S)(\1{3,})/g.test(c.value.replace(/\s+/g, ' '))
    ? { validateNo3Duplicate: true }
    : null
}

const validateHas2Case: ValidatorFn = (c: FormControl) => {
  return /[a-z]/ && /[A-Z]/.test(c.value) ? null : { validateHas2Case: true }
}

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(12),
    validateAlphaNumeric,
    validateSpecialChar,
    validateNo3Duplicate,
    validateHas2Case,
  ])

  password2: FormControl
  output = {}
  errMessage: string
  hide = true // #password
  compare = (c: FormControl) => {
    return c.value === this.password.value ? null : { compare: true }
  }

  constructor(
    private awsLambdaService: AwsLambdaService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    // should be expecting token from path.
    this.password2 = new FormControl('', [Validators.required, this.compare])
    this.route.queryParams.subscribe(params => {
      this.notificationService.debugLogging(params) // {order: "popular"}
      this.output = params
    })
  }

  submit() {
    this.loaderService.Show('Sending Reset password request...')
    this.notificationService.setPopUpTitle('BaaS - Setting New Password')

    this.errMessage = null
    const newCredential = { ...this.output, password: '' }
    newCredential.password = this.password.value
    this.awsLambdaService.confirmPassword(newCredential).subscribe(
      data => {
        this.loaderService.Hide()
        this.notificationService.notify('Password setting successful !!!')
        this.notificationService.debugLogging(
          'POST Request is successful ',
          data
        )
        this.router.navigate(['/login'])
      },
      error => {
        this.loaderService.Hide()
        if (error.error.statusCode === AppGlobalConstants.ApplicationError) {
          this.errMessage = 'New password is not accepted'
        }
        this.notificationService.debugLogging('Error', error)
      }
    )
  }
}
