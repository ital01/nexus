import { ValueObject } from '../base';

const CPF_CONSTANTS = {
  NON_DIGIT_REGEX: /\D/g,
  EXPECTED_LENGTH: 11,
  DIGIT_ONLY_REGEX: /^\d+$/,
  FIRST_GROUP_END: 3,
  SECOND_GROUP_START: 3,
  SECOND_GROUP_END: 6,
  THIRD_GROUP_START: 6,
  THIRD_GROUP_END: 9,
  CHECK_DIGITS_START: 9,
  DOT_SEPARATOR: '.',
  DASH_SEPARATOR: '-',
  FIRST_CHECK_DIGIT_BASE_LENGTH: 9,
  SECOND_CHECK_DIGIT_BASE_LENGTH: 10,
  MODULUS: 11,
  REMAINDER_THRESHOLD: 2,
  ZERO: 0,
  LOOP_START: 1,
  MIN_LENGTH: 0,
} as const;

interface ICpf {
  getDigits(): string;
  format(): string;
}

export class Cpf implements ValueObject, ICpf {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): Cpf {
    return new Cpf(value);
  }

  public isValid(): boolean {
    return this.validateCpf(this.value);
  }

  public isEmpty(): boolean {
    return !this.value || this.value.trim().length === CPF_CONSTANTS.MIN_LENGTH;
  }

  public clean(): string {
    return this.value.replace(CPF_CONSTANTS.NON_DIGIT_REGEX, '');
  }

  public format(): string {
    const cleaned = this.clean();
    if (cleaned.length === CPF_CONSTANTS.EXPECTED_LENGTH) {
      return `${cleaned.substring(CPF_CONSTANTS.MIN_LENGTH, CPF_CONSTANTS.FIRST_GROUP_END)}${CPF_CONSTANTS.DOT_SEPARATOR}${cleaned.substring(CPF_CONSTANTS.SECOND_GROUP_START, CPF_CONSTANTS.SECOND_GROUP_END)}${CPF_CONSTANTS.DOT_SEPARATOR}${cleaned.substring(CPF_CONSTANTS.THIRD_GROUP_START, CPF_CONSTANTS.THIRD_GROUP_END)}${CPF_CONSTANTS.DASH_SEPARATOR}${cleaned.substring(CPF_CONSTANTS.CHECK_DIGITS_START)}`;
    }
    return this.value;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Cpf): boolean {
    return this.clean() === other.clean();
  }

  public getDigits(): string {
    return this.clean();
  }

  private validateCpf(cpf: string): boolean {
    if (!cpf || cpf.trim().length === CPF_CONSTANTS.MIN_LENGTH) return false;

    const cleaned = this.clean();

    if (cleaned.length !== CPF_CONSTANTS.EXPECTED_LENGTH) return false;

    if (!CPF_CONSTANTS.DIGIT_ONLY_REGEX.test(cleaned)) return false;

    if (this.allDigitsSame(cleaned)) return false;

    const firstDigit = this.calculateCheckDigit(
      cleaned.substring(
        CPF_CONSTANTS.MIN_LENGTH,
        CPF_CONSTANTS.FIRST_CHECK_DIGIT_BASE_LENGTH,
      ),
    );
    if (
      firstDigit !==
      parseInt(cleaned[CPF_CONSTANTS.FIRST_CHECK_DIGIT_BASE_LENGTH])
    )
      return false;

    const secondDigit = this.calculateCheckDigit(
      cleaned.substring(
        CPF_CONSTANTS.MIN_LENGTH,
        CPF_CONSTANTS.SECOND_CHECK_DIGIT_BASE_LENGTH,
      ),
    );
    if (
      secondDigit !==
      parseInt(cleaned[CPF_CONSTANTS.SECOND_CHECK_DIGIT_BASE_LENGTH])
    )
      return false;

    return true;
  }

  private calculateCheckDigit(base: string): number {
    let sum = CPF_CONSTANTS.ZERO;
    const length = base.length;

    for (let i = CPF_CONSTANTS.MIN_LENGTH; i < length; i++) {
      sum += parseInt(base[i]) * (length + CPF_CONSTANTS.LOOP_START - i);
    }

    const remainder = sum % CPF_CONSTANTS.MODULUS;
    return remainder < CPF_CONSTANTS.REMAINDER_THRESHOLD
      ? CPF_CONSTANTS.ZERO
      : CPF_CONSTANTS.MODULUS - remainder;
  }

  private allDigitsSame(cpf: string): boolean {
    const firstDigit = cpf[CPF_CONSTANTS.MIN_LENGTH];
    for (let i = CPF_CONSTANTS.LOOP_START; i < cpf.length; i++) {
      if (cpf[i] !== firstDigit) return false;
    }
    return true;
  }
}
