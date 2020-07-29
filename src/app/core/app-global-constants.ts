/**
 * App Global Variables & Constants
 * As per https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
const httpErrorResponseCode = {
  InvalidHttpRequest: 400,
  TimeOutErrorCode: 401,
  UnauthorizedAccess: 403,
  REQUEST_SEMANTIC_ERROR: 422,
  InternalServerError: 500
};

export const AppGlobalConstants = {
  ApplicationError: 422,
  ClientPingInterval: 15,
  MaxAllowedIdleTimeInSeconds: 1020,
  TimeOutInSeconds: 180,
  GenericUnknownMimeType: 'application/octet-stream',
  HttpErrorResponseCode: httpErrorResponseCode,
  MinPasswordLength: 12
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
