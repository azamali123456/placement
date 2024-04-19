// CustomCNICValidator.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customCNIC', async: false })
export class CustomCNICValidator implements ValidatorConstraintInterface {
  validate(value: any) {
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;

    return cnicRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid CNIC number for Pakistan`;
  }
}
