import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { AppGlobalConstants } from './core/app-global-constants';
import {
  AppMessage,
  AppMessagesService
} from './core/services/app-messages.services';
import { AuthenticationService } from './core/services/authentication.service';
import { UserService } from './core/services/user.service';
import { NotificationService } from './shared/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BaaS';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private appMessagesService: AppMessagesService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Set idle timeout from AppGlobalConstants.MaxAllowedIdleTimeInSeconds
    this.idle.setIdle(AppGlobalConstants.MaxAllowedIdleTimeInSeconds);

    // Afer (AppGlobalConstants.MaxAllowedIdleTimeInSeconds + AppGlobalConstants.TimeOutInSeconds) of inactivity
    //   user is considered to be Timed-out and need to be redirected to login screen
    this.idle.setTimeout(AppGlobalConstants.TimeOutInSeconds);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.notificationService.debugLogging(this.idleState);

      this.notificationService.warning(
        this.appMessagesService.getMessage(AppMessage.SessionTimeOut),
        this.appMessagesService.getTitle(AppMessage.SessionTimeOut)
      );
      this.authenticationService.Logout();
      this.router.navigate(['/login']);
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You have gone idle!';
      this.notificationService.debugLogging(this.idleState);
    });
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      this.notificationService.debugLogging(this.idleState);
      this.reset();
    });

    this.idle.onTimeoutWarning.subscribe(countdown => {
      this.idleState = `You will time out in ${countdown} seconds!`;
      this.notificationService.debugLogging(this.idleState);
    });

    // Set the ping interval from AppGlobalConstants.ClientPingInterval
    this.keepalive.interval(AppGlobalConstants.ClientPingInterval);

    this.keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.authenticationService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        this.idle.watch();
        this.timedOut = false;
      } else {
        this.idle.stop();
      }
    });

    this.userService.GetLatestMenuContext();
  }

  private reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
}
