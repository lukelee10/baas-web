import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss']
})
export class LogOutComponent implements OnInit {
  constructor(
    private awsLambdaService: AwsLambdaService,
    public authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.awsLambdaService.auditLog(
      this.authenticationService.LoggedUser,
      'LogOut'
    );
    this.authenticationService.Logout();
    this.userService.GetLatestMenuContext(false);
  }
}
