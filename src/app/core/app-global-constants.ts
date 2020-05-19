import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * App Global Variables & Constants
 * As per https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
const httpErrorResponseCode = {
  InvalidHttpRequest: 400,
  TimeOutErrorCode: 401,
  UnathorizedAccess: 403,
  InternalServerError: 500
};

export const AppGlobalConstants = {
  ApplicationError: 422,
  ClientPingInterval: 15,
  MaxAllowedIdleTimeInSeconds: 1200,
  TimeOutInSeconds: 600,
  GenericUnknownMimeType: 'application/octet-stream',
  HttpErrorResponseCode: httpErrorResponseCode
};

export const enum UserRoles {
  FSPUser = 'FSP-User',
  Lead = 'Lead',
  Admin = 'Admin',
  NonFSPUser = 'Non-FSP-User'
}

export const enum FileMimeType {
  JP2 = 'image/jp2'
}

// A portion of the magic number
// How we got the magic Number:
// For JP2 Files:
// Read the initial chunk of JP2 files with the logic
// in FileUploadInputForDirective directive and got the magic number
// Got the same magic number after trying couple of JP2 files, so we
// are using to identify JP2 files
export const enum FileMagicNumber {
  JP2 = '000C6A502020'
}

export const enum RequestStatusFlags {
  Pending = 'PND',
  InvestigativeLead = 'INV',
  Error = 'ERR',
  NoLead = 'NL',
  EmptyString = 'NA'
}

// At least 1 special characters: `~!@#$%^&*()_+-={}|[]\:";'<>?,./
export const validateSpecialChar: ValidatorFn = (c: FormControl) => {
  const ascii = c.value.split('').map(ch => ch.charCodeAt());
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
    126
  ];
  const bag = ascii.filter(ch => specialRange.includes(ch));
  return bag.length >= 1 ? null : { validateSpecialChar: true };
};
export const validateAlphaNumeric: ValidatorFn = (c: FormControl) => {
  return /((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9]))/.test(c.value)
    ? null
    : { validateAlphaNumeric: true };
};

export const validateNo3Duplicate: ValidatorFn = (c: FormControl) => {
  return /(\S)(\1{3,})/g.test(c.value.replace(/\s+/g, ' '))
    ? { validateNo3Duplicate: true }
    : null;
};

export const validateHas2Case: ValidatorFn = (c: FormControl) => {
  return /[a-z]/ && /[A-Z]/.test(c.value) ? null : { validateHas2Case: true };
};
