import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { Subscription } from 'rxjs';

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
  durationInSeconds = 8;

  // Configuration api subscription
  private configState: Subscription;

  constructor(
    private matSnackBar: MatSnackBar) { }

 /**
  * Display a MatSnackbar notification and return the reference.
  * Will set the duration to the global configuration if present.
  */
  show(message: string, buttonLabel: string = 'OK'): MatSnackBarRef<any> {
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
