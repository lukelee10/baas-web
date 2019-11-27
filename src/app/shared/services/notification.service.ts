import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarRef } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { MessageDialogComponent } from '../../shared/components/message-dialog/message-dialog.component';
import { environment } from './../../../environments/environment';

/**
 * Provides an abstract wrapper around showing a MatSnackbar
 * notification based on global environment or API provided
 * configuration.
 *
 * This class Listens for the authentication state to change.
 * Once the state becomes authenticated, retrieve the startup
 * configuration from the API service. Once de-authenticated
 * set the _params to undefined and unsubscribe.
 */
@Injectable({
  providedIn: 'root'
})

export class NotificationService implements OnDestroy {
  private popUpTitle: string;
  private logLevel: boolean;
  private durationInSeconds = 5;

  // Configuration api subscription
  private configState: Subscription;

  constructor(
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) {
    this.logLevel = environment.production;
  }

  setPopUpTitle(popUpTitle: string) {
    this.popUpTitle = popUpTitle;
  }

/**
 * This is the debugLogging method.
 * Use this method when the console logging should only happen in non-production environment.
 * @param message This is the message parameter to be logged to console
 * @returns returns void
 */
  debugLogging(message?: any, ...optionalParams: any[]): void {
    if (!this.logLevel) {
      console.log(message, ...optionalParams);
    }
  }

  successful(message: string, popUpTitle?: string): void {
    this.dialog.open(MessageDialogComponent, {
      data: {
        title: popUpTitle === null ? this.popUpTitle : popUpTitle,
        message,
        success: true
      }
    });
  }

  warning(message: string, popUpTitle?: string): void {
    this.dialog.open(MessageDialogComponent, {
      data: {
        title: popUpTitle === null ? this.popUpTitle : popUpTitle,
        message,
        warn: true
      }
    });
  }

  error(message: string, popUpTitle?: string): void {
    this.dialog.open(MessageDialogComponent, {
      data: {
        title: popUpTitle === null ? this.popUpTitle : popUpTitle,
        message,
        error: true
      }
    });
  }

 /**
  * Display a MatSnackbar notification and return the reference.
  * Will set the duration to the global configuration if present.
  */
  notify(message: string, buttonLabel: string = 'OK'): MatSnackBarRef<any> {
    if (this.durationInSeconds > 0) {
      return this.matSnackBar.open(message, buttonLabel, {
        duration: this.durationInSeconds * 1000,
      });
    } else {
      return this.matSnackBar.open(message, buttonLabel, {
      });
    }
  }

  /**
   * Unsubscribe from the config state
   * when the component is destroyed, and remove
   * the in-memory parameters.
   */
  ngOnDestroy() {
    this.configState.unsubscribe();
  }
}
