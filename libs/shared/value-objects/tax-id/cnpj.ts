import { ValueObject } from '../base';

const CNPJ_CONSTANTS = {
  NON_ALPHANUMERIC_REGEX: /[^0-9A-Za-z]/g,
  ALPHANUMERIC_REGEX: /^[0-9A-Z]+$/,
  TWO_DIGITS_REGEX: /^\d{2}$/,
  EXPECTED_LENGTH: 14,
  FIRST_CHECK_BASE_LENGTH: 12,
  SECOND_CHECK_BASE_LENGTH: 13,
  CHECK_DIGITS_LENGTH: 2,
  FIRST_GROUP_END: 2,
  SECOND_GROUP_START: 2,
  SECOND_GROUP_END: 5,
  THIRD_GROUP_START: 5,
  THIRD_GROUP_END: 8,
  FOURTH_GROUP_START: 8,
  FOURTH_GROUP_END: 12,
  CHECK_DIGITS_START: 12,
  DOT_SEPARATOR: '.',
  SLASH_SEPARATOR: '/',
  DASH_SEPARATOR: '-',
  FIRST_WEIGHTS: [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const,
  SECOND_WEIGHTS: [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const,
  ASCII_DIGIT_START: 48,
  ASCII_DIGIT_END: 57,
  ASCII_OFFSET: 48,
  MODULUS: 11,
  REMAINDER_THRESHOLD: 2,
  ZERO: 0,
  LOOP_START: 1,
  MIN_LENGTH: 0,
} as const;

interface ICnpj {
  getDigits(): string;
  format(): string;
}

export class Cnpj implements ValueObject, ICnpj {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): Cnpj {
    return new Cnpj(value);
  }

  public isValid(): boolean {
    return this.validateCnpj(this.value);
  }

  public isEmpty(): boolean {
    return (
      !this.value || this.value.trim().length === CNPJ_CONSTANTS.MIN_LENGTH
    );
  }

  public clean(): string {
    return this.value
      .replace(CNPJ_CONSTANTS.NON_ALPHANUMERIC_REGEX, '')
      .toUpperCase();
  }

  public format(): string {
    const cleaned = this.clean();
    if (cleaned.length === CNPJ_CONSTANTS.EXPECTED_LENGTH) {
      return `${cleaned.substring(CNPJ_CONSTANTS.MIN_LENGTH, CNPJ_CONSTANTS.FIRST_GROUP_END)}${CNPJ_CONSTANTS.DOT_SEPARATOR}${cleaned.substring(CNPJ_CONSTANTS.SECOND_GROUP_START, CNPJ_CONSTANTS.SECOND_GROUP_END)}${CNPJ_CONSTANTS.DOT_SEPARATOR}${cleaned.substring(CNPJ_CONSTANTS.THIRD_GROUP_START, CNPJ_CONSTANTS.THIRD_GROUP_END)}${CNPJ_CONSTANTS.SLASH_SEPARATOR}${cleaned.substring(CNPJ_CONSTANTS.FOURTH_GROUP_START, CNPJ_CONSTANTS.FOURTH_GROUP_END)}${CNPJ_CONSTANTS.DASH_SEPARATOR}${cleaned.substring(CNPJ_CONSTANTS.CHECK_DIGITS_START)}`;
    }
    return this.value;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Cnpj): boolean {
    return this.clean() === other.clean();
  }

  public getDigits(): string {
    return this.clean();
  }

  private validateCnpj(cnpj: string): boolean {
    if (!cnpj || cnpj.trim().length === CNPJ_CONSTANTS.MIN_LENGTH) return false;

    const cleaned = this.clean();

    if (cleaned.length !== CNPJ_CONSTANTS.EXPECTED_LENGTH) return false;

    if (!CNPJ_CONSTANTS.ALPHANUMERIC_REGEX.test(cleaned)) return false;

    if (this.allCharactersSame(cleaned)) return false;

    if (
      !CNPJ_CONSTANTS.TWO_DIGITS_REGEX.test(
        cleaned.substring(CNPJ_CONSTANTS.CHECK_DIGITS_START),
      )
    )
      return false;

    const firstDigit = this.calculateFirstCheckDigit(
      cleaned.substring(
        CNPJ_CONSTANTS.MIN_LENGTH,
        CNPJ_CONSTANTS.FIRST_CHECK_BASE_LENGTH,
      ),
    );
    if (
      firstDigit !== parseInt(cleaned[CNPJ_CONSTANTS.FIRST_CHECK_BASE_LENGTH])
    )
      return false;

    const secondDigit = this.calculateSecondCheckDigit(
      cleaned.substring(
        CNPJ_CONSTANTS.MIN_LENGTH,
        CNPJ_CONSTANTS.SECOND_CHECK_BASE_LENGTH,
      ),
    );
    if (
      secondDigit !== parseInt(cleaned[CNPJ_CONSTANTS.SECOND_CHECK_BASE_LENGTH])
    )
      return false;

    return true;
  }

  private calculateFirstCheckDigit(base: string): number {
    let sum = CNPJ_CONSTANTS.ZERO;

    for (
      let i = CNPJ_CONSTANTS.MIN_LENGTH;
      i < CNPJ_CONSTANTS.FIRST_CHECK_BASE_LENGTH;
      i++
    ) {
      sum += this.getNumericValue(base[i]) * CNPJ_CONSTANTS.FIRST_WEIGHTS[i];
    }

    const remainder = sum % CNPJ_CONSTANTS.MODULUS;
    return remainder < CNPJ_CONSTANTS.REMAINDER_THRESHOLD
      ? CNPJ_CONSTANTS.ZERO
      : CNPJ_CONSTANTS.MODULUS - remainder;
  }

  private calculateSecondCheckDigit(base: string): number {
    let sum = CNPJ_CONSTANTS.ZERO;

    for (
      let i = CNPJ_CONSTANTS.MIN_LENGTH;
      i < CNPJ_CONSTANTS.SECOND_CHECK_BASE_LENGTH;
      i++
    ) {
      sum += this.getNumericValue(base[i]) * CNPJ_CONSTANTS.SECOND_WEIGHTS[i];
    }

    const remainder = sum % CNPJ_CONSTANTS.MODULUS;
    return remainder < CNPJ_CONSTANTS.REMAINDER_THRESHOLD
      ? CNPJ_CONSTANTS.ZERO
      : CNPJ_CONSTANTS.MODULUS - remainder;
  }

  private getNumericValue(char: string): number {
    const code = char.charCodeAt(0);
    if (
      code >= CNPJ_CONSTANTS.ASCII_DIGIT_START &&
      code <= CNPJ_CONSTANTS.ASCII_DIGIT_END
    ) {
      return code - CNPJ_CONSTANTS.ASCII_OFFSET;
    }
    return code - CNPJ_CONSTANTS.ASCII_OFFSET;
  }

  private allCharactersSame(cnpj: string): boolean {
    const firstChar = cnpj[CNPJ_CONSTANTS.MIN_LENGTH];
    for (let i = CNPJ_CONSTANTS.LOOP_START; i < cnpj.length; i++) {
      if (cnpj[i] !== firstChar) return false;
    }
    return true;
  }
}
