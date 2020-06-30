import {
  AbstractControl,
  FormControl,
  Validators,
  ValidatorFn
} from '@angular/forms';

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
/** Helper function for generating arrays of integer ranges. */
function getIntsInRange(startingInt: number, endingInt: number): Array<number> {
  const iInclusiveItemCount = 1 + endingInt - startingInt;
  const aNums = new Array(iInclusiveItemCount);
  for (let i = 0; i < iInclusiveItemCount; i++) {
    aNums[i] = i + startingInt;
  }
  return aNums;
}

/** Helper function for generating arrays of character ranges. */
function getCharsBetween(startChar: string, endChar: string): Array<string> {
  const charCodeStart = startChar.charCodeAt(0);
  const charCodeEnd = endChar.charCodeAt(0);
  const aCharCodesInRange = getIntsInRange(charCodeStart, charCodeEnd);
  return Array.from(String.fromCharCode(...aCharCodesInRange));
}

export const PasswordCharacterClasses = {
  AlphaUpper: new Set(getCharsBetween('A', 'Z')),
  AlphaLower: new Set(getCharsBetween('a', 'z')),
  NumericDigits: new Set(getCharsBetween('0', '9')),
  SpecialChars: new Set([...'`~!@#$%^&*()_+-={}|[]\\:";\'<>?,./'])
};
/**
 * Function to simply check if value is NULL and return default if it is. This
 * function exists solely to centralize this conditional branch to avoid making
 * a conditional branch in every "validate*" function below.
 */
const requireNonNullOrElse = (val, defVal = '') =>
  val !== null ? val : defVal;

/**
 * Escape a provided string so it is suitable for embedding into a RegEx
 * pattern. I hate this approach, but JavaScript does not have a built-in
 * approach for this.
 * This function is basically stolen from baas-services/baasGeneralUtils
 *
 * @method escapeRegExp
 * @param {string} str String to escape as a RegEx pattern.
 * @return {string} String with regexp special characters escaped.
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

export const validateHasSpecialChar: ValidatorFn = (control: FormControl) => {
  const oFailureResult = {
    validateHasSpecialChar:
      'Must contain special characters from the following set: ' +
      [...PasswordCharacterClasses.SpecialChars].join('')
  };
  const aCharsInField = [...requireNonNullOrElse(control.value)];
  const bHasChars = aCharsInField.some(c =>
    PasswordCharacterClasses.SpecialChars.has(c)
  );
  return bHasChars ? null : oFailureResult;
};

export const validateHasAlphaLower: ValidatorFn = (control: FormControl) => {
  const oFailureResult = {
    validateHasAlphaLower: 'Must contain lowercase characters'
  };
  const aCharsInField = [...requireNonNullOrElse(control.value)];
  const bHasChars = aCharsInField.some(c =>
    PasswordCharacterClasses.AlphaLower.has(c)
  );
  return bHasChars ? null : oFailureResult;
};

export const validateHasAlphaUpper: ValidatorFn = (control: FormControl) => {
  const oFailureResult = {
    validateHasAlphaUpper: 'Must contain uppercase characters'
  };
  const aCharsInField = [...requireNonNullOrElse(control.value)];
  const bHasChars = aCharsInField.some(c =>
    PasswordCharacterClasses.AlphaUpper.has(c)
  );
  return bHasChars ? null : oFailureResult;
};

export const validateHasNumeric: ValidatorFn = (control: FormControl) => {
  const oFailureResult = {
    validateHasNumeric: 'Must contain numeric digits'
  };
  const aCharsInField = [...requireNonNullOrElse(control.value)];
  const bHasDigits = aCharsInField.some(c =>
    PasswordCharacterClasses.NumericDigits.has(c)
  );
  return bHasDigits ? null : oFailureResult;
};

/** @todo This check is not in compliance with security requirements. */
export const validateNo3Duplicate: ValidatorFn = (c: FormControl) => {
  return /(\S)(\1{3,})/g.test(
    requireNonNullOrElse(c.value).replace(/\s+/g, ' ')
  )
    ? { validateNo3Duplicate: true }
    : null;
};

export const PasswordValidators = {
  CharClassValidators: [
    validateHasSpecialChar,
    validateHasNumeric,
    validateHasAlphaUpper,
    validateHasAlphaLower,
    validateNo3Duplicate
  ],
  buildForbiddenUserIdValidator: (userId: string): ValidatorFn => {
    // String replacement below is stolen from baas-services/baasGeneralUtils
    const sRegExEscapedUserId = userId.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    const oFailureResult = {
      forbiddenUserId: 'Cannot contain username'
    };
    return (control: AbstractControl) => {
      const forbiddenPattern = new RegExp(`^.*${sRegExEscapedUserId}.*$`, 'gi');
      const sValToTest = requireNonNullOrElse(control.value);
      return forbiddenPattern.test(sValToTest) ? oFailureResult : null;
    };
  }
};
