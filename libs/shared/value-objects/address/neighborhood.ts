import { ValueObject } from '../base';

const NEIGHBORHOOD_CONSTANTS = {
  EMPTY_STRING: '',
  MIN_LENGTH: 2,
  MAX_LENGTH: 100,
  LETTERS_SPACES_REGEX: /^[a-zA-ZÀ-ÿ\s\-\.]+$/,
  TRIM_REGEX: /^\s+|\s+$/g,
} as const;

export class Neighborhood implements ValueObject {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): Neighborhood {
    return new Neighborhood(value);
  }

  public isValid(): boolean {
    return this.validateNeighborhood(this.value);
  }

  public isEmpty(): boolean {
    return !this.value || this.value.trim().length === 0;
  }

  public clean(): string {
    return this.value.replace(
      NEIGHBORHOOD_CONSTANTS.TRIM_REGEX,
      NEIGHBORHOOD_CONSTANTS.EMPTY_STRING,
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

  public equals(other: Neighborhood): boolean {
    return this.clean().toLowerCase() === other.clean().toLowerCase();
  }

  private validateNeighborhood(neighborhood: string): boolean {
    if (!neighborhood || neighborhood.trim().length === 0) return false;

    const cleaned = this.clean();
    const length = cleaned.length;

    if (
      length < NEIGHBORHOOD_CONSTANTS.MIN_LENGTH ||
      length > NEIGHBORHOOD_CONSTANTS.MAX_LENGTH
    )
      return false;

    if (!NEIGHBORHOOD_CONSTANTS.LETTERS_SPACES_REGEX.test(cleaned))
      return false;

    return true;
  }
}
