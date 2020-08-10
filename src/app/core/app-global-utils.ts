import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

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

const PasswordCharacterClasses = {
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
 * @param str String to escape as a RegEx pattern.
 * @return String with regexp special characters escaped.
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

export const validateNo3Duplicate: ValidatorFn = (c: FormControl) => {
  const iMaxContinuousSameClass = 4;
  const aCharStrings = [...Object.values(PasswordCharacterClasses)]
    .map(aset => Array.from(aset))
    .map(a => a.join(''));
  const aRegPats = aCharStrings
    .map(escapeRegExp)
    .map(s => new RegExp(`.*[ ${s}]{${iMaxContinuousSameClass}}.*`, 'g'));

  const sval = requireNonNullOrElse(c.value);
  const bDoesHaveStreakOfSameClass = aRegPats.some(pat => pat.test(sval));
  return bDoesHaveStreakOfSameClass ? { validateNo3Duplicate: true } : null;
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
    const sRegExEscapedUserId = escapeRegExp(userId);
    const oFailureResult = {
      forbiddenUserId: 'Cannot contain username'
    };
    return (control: AbstractControl) => {
      const forbiddenPattern = new RegExp(`^.*${sRegExEscapedUserId}.*$`, 'gi');
      const sValToTest = requireNonNullOrElse(control.value);
      return forbiddenPattern.test(sValToTest) ? oFailureResult : null;
    };
  },
  validateNoFirstName: (firstName: string): ValidatorFn => {
    const sRegExEscapedFirstName = escapeRegExp(firstName);
    const oFailureResult = {
      forbiddenFirstName: 'Cannot contain first name'
    };
    return (control: AbstractControl) => {
      const forbiddenPattern = new RegExp(
        `^.*${sRegExEscapedFirstName}.*$`,
        'gi'
      );
      const sValToTest = requireNonNullOrElse(control.value);
      return forbiddenPattern.test(sValToTest) ? oFailureResult : null;
    };
  },
  validateNoLastName: (lastName: string): ValidatorFn => {
    const sRegExEscapedLastName = escapeRegExp(lastName);
    const oFailureResult = {
      forbiddenLastName: 'Cannot contain last name'
    };
    return (control: AbstractControl) => {
      const forbiddenPattern = new RegExp(
        `^.*${sRegExEscapedLastName}.*$`,
        'gi'
      );
      const sValToTest = requireNonNullOrElse(control.value);
      return forbiddenPattern.test(sValToTest) ? oFailureResult : null;
    };
  }
};
