import { ValueObject } from '../base';

const STREET_CONSTANTS = {
  EMPTY_STRING: '',
  MIN_LENGTH: 2,
  MAX_LENGTH: 200,
  LETTERS_NUMBERS_SPACES_REGEX: /^[a-zA-ZÀ-ÿ0-9\s\-\.]+$/,
  TRIM_REGEX: /^\s+|\s+$/g,
} as const;

export class Street implements ValueObject {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): Street {
    return new Street(value);
  }

  public isValid(): boolean {
    return this.validateStreet(this.value);
  }

  public isEmpty(): boolean {
    return !this.value || this.value.trim().length === 0;
  }

  public clean(): string {
    return this.value.replace(
      STREET_CONSTANTS.TRIM_REGEX,
      STREET_CONSTANTS.EMPTY_STRING,
    );
  }

  public format(): string {
    const cleaned = this.clean();
    const words = cleaned.split(/\s+/);
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Street): boolean {
    return this.clean().toLowerCase() === other.clean().toLowerCase();
  }

  private validateStreet(street: string): boolean {
    if (!street || street.trim().length === 0) return false;

    const cleaned = this.clean();
    const length = cleaned.length;

    if (
      length < STREET_CONSTANTS.MIN_LENGTH ||
      length > STREET_CONSTANTS.MAX_LENGTH
    )
      return false;

    if (!STREET_CONSTANTS.LETTERS_NUMBERS_SPACES_REGEX.test(cleaned))
      return false;

    return true;
  }
}
