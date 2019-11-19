# BaasWeb
#  Branch REACTS#1930 User Agreement Acceptance after Login - BaaS 1.0
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.5.

## Loader Service

LoaderService service is to show Busy/Loading popup during http requests/lengthy processes.

To use:
1. Add private loaderService: LoaderService in component constructor
2. this.loaderService.Show(optional message to display in popup); -> to show popup
3. this.loaderService.Hide(); -> to hide popup window


## Message Dialog Component

Message Dialog Component is a reusable component.
1. With this we can avoid using plain old alert javascript
2. This component is configured for Success, Warning, and Error messages (themes)
3. To use in a component:
   * import the MessageDialogComponent
   * Add private dialog: MatDialog in constructor
   * After your event (for example after a server call), use the following (similar code)
      ```
      // Do Something

      // Then show what happened to the user
      this.dialog.open(MessageDialogComponent, {
        data: {
          message: 'Update not fully successful with warnings; Update not fully successful with warnings',
          warn: true,
        }
      });
      ```

## Confirmation Dialog Component

Added the Confirmation Dialog Component to baaS Web.  This is reusuable and shared component, which shows the Confirmation dialog in cases like disable a user etc.,.  This component's Title and Content can be configured from the calling component.
To use:
1. Import ConfirmationDialogComponent
2. Add private dialog: MatDialog in component constructor
3. Add the following chunk of code where ever you want to show the Confirmation Dialog:
    ```
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Disable',
        message: 'Are you sure you want to disable the user?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alert('Yes clicked');
        // DO SOMETHING
      }
    });
    ```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
