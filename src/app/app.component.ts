import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { debugLogging } from 'src/environments/environment';

import { AppGlobalConstants } from './core/app-globals';
import { AuthenticationService } from './core/services/authentication.service';
import { MessageDialogComponent } from './shared/components/message-dialog/message-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BaaS';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(
    private dialog: MatDialog,
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // Set idle timeout from AppGlobalConstants.MaxAllowedIdleTimeInSeconds
    idle.setIdle(AppGlobalConstants.MaxAllowedIdleTimeInSeconds);

    // Afer (AppGlobalConstants.MaxAllowedIdleTimeInSeconds + AppGlobalConstants.TimeOutInSeconds) of inactivity
    //   user is considered to be Timed-out and need to be redirected to login screen
    idle.setTimeout(AppGlobalConstants.TimeOutInSeconds);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      debugLogging(this.idleState);
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'BaaS Alert',
          message: 'Your session has timed out.',
          warn: true
        }
      });
      this.authenticationService.Logout();
      this.router.navigate(['/login']);
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You have gone idle!';
      debugLogging(this.idleState);
    });
    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      debugLogging(this.idleState);
      this.reset();
    });

    idle.onTimeoutWarning.subscribe(countdown => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      debugLogging(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.authenticationService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });

   // this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
}
