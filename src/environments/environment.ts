/**
 * This file can be replaced during build by using the `fileReplacements` array.
 * `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
 * The list of file replacements can be found in `angular.json`.
 */

import { awsConfig } from './awsConfig';

export const environment = {
  production: false,

/**
 * BaasDevVer1UserPool Configurations
 * This is for Developers
 * These are the default settings point to BaasDevVer1UserPool stack,
 * and these values can be changed if a developer wants to use their own stack
 *
 * For Cognito
 */
  cognito: awsConfig.cognito,
  
  /**
   * BaasDevVer1UserPool Configurations
   * This is for Developers
   * These are the default settings point to BaasDevVer1UserPool stack,
   * and these values can be changed if a developer wants to use their own stack
   *
   * For API Gateway
   */
  apiGateway: awsConfig.apiGateway
};




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
