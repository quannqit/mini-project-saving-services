import { ValidationError } from 'class-validator';

export function errorMessages(errors: ValidationError[]) {
  return errors
    .map((val: any) => {
      return Object.values(val.constraints)[0] as string;
    })
    .join();
}
