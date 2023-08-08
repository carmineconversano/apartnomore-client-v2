import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class CustomValidators {
  /**
   * Validates that child controls in the form group are equal
   */

  static PublicValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    console.log(control)
    const isPublic = control.get('isPublic')?.value;
    const accessLink = control.get('accessLink')?.value;

    if (isPublic === null || isPublic === undefined || accessLink === null || accessLink === undefined) {
      return null;
    }

    return isPublic && accessLink.trim().length > 0 || !isPublic
      ? null
      : {accessLink: true};
  };
}
