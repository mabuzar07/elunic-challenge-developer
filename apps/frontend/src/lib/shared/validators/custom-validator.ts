import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && typeof value === 'string' && value.trim().length === 0) {
        return { whitespace: true };
      }
      return null;
    };
  }

  static maxWords(maxWords: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && typeof value === 'string') {
        const wordCount = value.trim().split(/\s+/).length;
        if (wordCount > maxWords) {
          return { maxWords: { actualWords: wordCount, maxWords } };
        }
      }
      return null;
    };
  }

  static emailDomain(allowedDomains: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && typeof value === 'string' && value.includes('@')) {
        const domain = value.split('@')[1];
        if (!allowedDomains.includes(domain)) {
          return { emailDomain: { domain, allowedDomains } };
        }
      }
      return null;
    };
  }
}
