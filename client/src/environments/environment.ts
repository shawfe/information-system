// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const configuration = require('../../configuration.dev');

export const environment = {
  production: false,
  API_VERSION: configuration.API_VERSION,
  BACKEND_URL: configuration.BACKEND_URL,
  BACKEND_PORT: configuration.BACKEND_PORT,
  CODE_EXECUTION_URL: configuration.CODE_EXECUTION_URL,
  CODE_EXECUTION_PORT: configuration.CODE_EXECUTION_PORT,
  ICONSET_PATH: 'assets/icons/icons-set.svg',
  locales: ['en', 'ru'],
  defaultLocale: 'ru',

  contentful: {
    spaceId: 'eucy64979al8',
    token: '7hll8dIHxIyFEovCQqxSo1ulY0cVrTpMENsX-rvcI1A'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
