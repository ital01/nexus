import { ValueObject } from '../base';

const JWT_CONSTANTS = {
  IS_VALID: true,
  IS_EMPTY: false,
  EMPTY_OBJECT: {} as const,
} as const;

interface IJwt {
  decode<T = object>(): T;
}

export class Jwt implements ValueObject, IJwt {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): Jwt {
    return new Jwt(value);
  }

  public isValid(): boolean {
    return JWT_CONSTANTS.IS_VALID;
  }

  public isEmpty(): boolean {
    return JWT_CONSTANTS.IS_EMPTY;
  }

  public clean(): string {
    return this.value;
  }

  public format(): string {
    return this.value;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Jwt): boolean {
    return this.value === other.value;
  }

  public decode<T = object>(): T {
    return JWT_CONSTANTS.EMPTY_OBJECT as T;
  }
}
