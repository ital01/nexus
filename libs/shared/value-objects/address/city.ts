import { ValueObject } from '../base';

const CITY_CONSTANTS = {
  EMPTY_STRING: '',
  MIN_LENGTH: 2,
  MAX_LENGTH: 100,
  LETTERS_SPACES_REGEX: /^[a-zA-ZÀ-ÿ\s]+$/,
  TRIM_REGEX: /^\s+|\s+$/g,
} as const;

export class City implements ValueObject {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): City {
    return new City(value);
  }

  public isValid(): boolean {
    return this.validateCity(this.value);
  }

  public isEmpty(): boolean {
    return !this.value || this.value.trim().length === 0;
  }

  public clean(): string {
    return this.value.replace(
      CITY_CONSTANTS.TRIM_REGEX,
      CITY_CONSTANTS.EMPTY_STRING,
    );
  }

  public format(): string {
    const cleaned = this.clean();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: City): boolean {
    return this.clean().toLowerCase() === other.clean().toLowerCase();
  }

  private validateCity(city: string): boolean {
    if (!city || city.trim().length === 0) return false;

    const cleaned = this.clean();
    const length = cleaned.length;

    if (
      length < CITY_CONSTANTS.MIN_LENGTH ||
      length > CITY_CONSTANTS.MAX_LENGTH
    )
      return false;

    if (!CITY_CONSTANTS.LETTERS_SPACES_REGEX.test(cleaned)) return false;

    return true;
  }
}
