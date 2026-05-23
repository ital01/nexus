import { ValueObject } from '../base';

const CEP_CONSTANTS = {
  EMPTY_STRING: '',
  NON_DIGIT_REGEX: /\D/g,
  DASH: '-',
  EXPECTED_LENGTH: 8,
  FIRST_PART_END: 5,
  FIRST_DIGIT_POS: 0,
  MIN_DIGIT: 0,
  MAX_DIGIT: 9,
  DIGIT_ONLY_REGEX: /^\d+$/,
} as const;

export class Cep implements ValueObject {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): Cep {
    return new Cep(value);
  }

  public isValid(): boolean {
    return this.validateCep(this.value);
  }

  public isEmpty(): boolean {
    return !this.value || this.value.trim().length === CEP_CONSTANTS.MIN_DIGIT;
  }

  public clean(): string {
    return this.value.replace(
      CEP_CONSTANTS.NON_DIGIT_REGEX,
      CEP_CONSTANTS.EMPTY_STRING,
    );
  }

  public format(): string {
    const cleaned = this.clean();
    if (cleaned.length === CEP_CONSTANTS.EXPECTED_LENGTH) {
      return `${cleaned.substring(CEP_CONSTANTS.FIRST_DIGIT_POS, CEP_CONSTANTS.FIRST_PART_END)}${CEP_CONSTANTS.DASH}${cleaned.substring(CEP_CONSTANTS.FIRST_PART_END)}`;
    }
    return this.value;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Cep): boolean {
    return this.clean() === other.clean();
  }

  private validateCep(cep: string): boolean {
    if (!cep || cep.trim().length === CEP_CONSTANTS.MIN_DIGIT) return false;

    const cleaned = this.clean();

    if (cleaned.length !== CEP_CONSTANTS.EXPECTED_LENGTH) return false;

    if (!CEP_CONSTANTS.DIGIT_ONLY_REGEX.test(cleaned)) return false;

    const firstDigit = parseInt(
      cleaned.substring(CEP_CONSTANTS.FIRST_DIGIT_POS, 1),
    );
    if (
      isNaN(firstDigit) ||
      firstDigit < CEP_CONSTANTS.MIN_DIGIT ||
      firstDigit > CEP_CONSTANTS.MAX_DIGIT
    )
      return false;

    return true;
  }
}
