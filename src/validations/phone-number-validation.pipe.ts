// CustomPhoneValidator.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customPhone', async: false })
export class CustomPhoneValidator implements ValidatorConstraintInterface {
  validate(value: any) {
    const phoneNumberRegexWithCountryCode = /^\+92[0-9]{10}$/;
    const phoneNumberRegexWithoutCountryCode = /^[0-9]+$/;

    return (
      phoneNumberRegexWithCountryCode.test(value) ||
      phoneNumberRegexWithoutCountryCode.test(value)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid phone number with or without the country code`;
  }
}
