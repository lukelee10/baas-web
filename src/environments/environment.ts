/**
 * This file can be replaced during build by using the `fileReplacements` array.
 * `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
 * The list of file replacements can be found in `angular.json`.
 */

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
  cognito: {
    userPoolId: 'us-east-1_d0pS2RvfU',
    appClientId: '1c9hvrl1ckt5m5il817ho69cor',
    awsRegion: 'us-east-1'
  },

  /**
   * BaasDevVer1UserPool Configurations
   * This is for Developers
   * These are the default settings point to BaasDevVer1UserPool stack,
   * and these values can be changed if a developer wants to use their own stack
   *
   * For API Gateway
   */
  apiGateway: {
    url: 'https://2qkxtancaa.execute-api.us-east-1.amazonaws.com/DevVer1',
    awsRegion: 'us-east-1'
  },

  /**
   * EBS API Gateway
   */
  ebsApiGateway: {
    url: 'https://ssl.biou.spartansdo.com/ebsMockWeb/tide/_search',
    awsRegion: 'us-east-1'
  }
};

/**
 * This is the debugLogging method.
 * Use this method when the console logging should only happen in non-production environment.
 * @param message This is the message parameter to be logged to console
 * @returns returns void
 */
export function debugLogging(message?: any): void {
  if (!environment.production) {
    console.log(message);
  }
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
