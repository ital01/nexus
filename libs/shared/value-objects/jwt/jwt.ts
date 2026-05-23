import { ValueObject } from '../base';

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
    return true;
  }

  public isEmpty(): boolean {
    return false;
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
    return {} as T;
  }
}
