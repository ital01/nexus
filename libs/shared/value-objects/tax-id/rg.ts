import { ValueObject } from '../base';

const RG_CONSTANTS = {
  EMPTY_STRING: '',
  NON_DIGIT_REGEX: /\D/g,
  DIGIT_ONLY_REGEX: /^\d+$/,
  MAX_LENGTH: 9,
  MIN_LENGTH: 7,
  MEDIUM_LENGTH: 8,
  FIRST_GROUP_END: 2,
  SECOND_GROUP_START: 2,
  SECOND_GROUP_END: 5,
  THIRD_GROUP_START: 5,
  THIRD_GROUP_END: 8,
  CHECK_DIGIT_POS: 8,
  RJ_CHECK_DIGIT_POS: 7,
  DOT_SEPARATOR: '.',
  DASH_SEPARATOR: '-',
  UF_SP: 'SP',
  UF_RJ: 'RJ',
  UF_MG: 'MG',
  SP_WEIGHTS: [2, 3, 4, 5, 6, 7, 8, 9] as const,
  RJ_WEIGHTS: [2, 7, 6, 5, 4, 3, 2] as const,
  MG_WEIGHTS: [1, 2, 3, 4, 5, 6, 7, 8] as const,
  SP_BASE_LENGTH: 8,
  RJ_BASE_LENGTH: 7,
  MG_BASE_LENGTH: 8,
  MODULUS: 11,
  REMAINDER_THRESHOLD: 2,
  ZERO: 0,
  LOOP_START: 0,
  ZERO_LENGTH: 0,
} as const;

interface IRg {
  getDigits(): string;
  getUf(): string;
  format(): string;
}

export class Rg implements ValueObject, IRg {
  private value: string;
  private uf: string;

  private constructor(value: string, uf: string = RG_CONSTANTS.EMPTY_STRING) {
    this.value = value;
    this.uf = uf;
  }

  public static from(
    value: string,
    uf: string = RG_CONSTANTS.EMPTY_STRING,
  ): Rg {
    return new Rg(value, uf);
  }

  public isValid(): boolean {
    return this.validateRg(this.value);
  }

  public isEmpty(): boolean {
    return !this.value || this.value.trim().length === RG_CONSTANTS.ZERO_LENGTH;
  }

  public clean(): string {
    return this.value.replace(
      RG_CONSTANTS.NON_DIGIT_REGEX,
      RG_CONSTANTS.EMPTY_STRING,
    );
  }

  public format(): string {
    const cleaned = this.clean();
    if (cleaned.length === RG_CONSTANTS.MAX_LENGTH) {
      return `${cleaned.substring(RG_CONSTANTS.ZERO_LENGTH, RG_CONSTANTS.FIRST_GROUP_END)}${RG_CONSTANTS.DOT_SEPARATOR}${cleaned.substring(RG_CONSTANTS.SECOND_GROUP_START, RG_CONSTANTS.SECOND_GROUP_END)}${RG_CONSTANTS.DOT_SEPARATOR}${cleaned.substring(RG_CONSTANTS.THIRD_GROUP_START, RG_CONSTANTS.THIRD_GROUP_END)}${RG_CONSTANTS.DASH_SEPARATOR}${cleaned.substring(RG_CONSTANTS.CHECK_DIGIT_POS)}`;
    }
    if (cleaned.length === RG_CONSTANTS.MEDIUM_LENGTH) {
      return `${cleaned.substring(RG_CONSTANTS.ZERO_LENGTH, RG_CONSTANTS.FIRST_GROUP_END)}${RG_CONSTANTS.DOT_SEPARATOR}${cleaned.substring(RG_CONSTANTS.SECOND_GROUP_START, RG_CONSTANTS.SECOND_GROUP_END)}${RG_CONSTANTS.DOT_SEPARATOR}${cleaned.substring(RG_CONSTANTS.THIRD_GROUP_START, RG_CONSTANTS.THIRD_GROUP_END)}`;
    }
    return this.value;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Rg): boolean {
    return this.clean() === other.clean() && this.uf === other.uf;
  }

  public getDigits(): string {
    return this.clean();
  }

  public getUf(): string {
    return this.uf;
  }

  private validateRg(rg: string): boolean {
    if (!rg || rg.trim().length === RG_CONSTANTS.ZERO_LENGTH) return false;

    const cleaned = this.clean();

    if (
      cleaned.length < RG_CONSTANTS.MIN_LENGTH ||
      cleaned.length > RG_CONSTANTS.MAX_LENGTH
    )
      return false;

    if (!RG_CONSTANTS.DIGIT_ONLY_REGEX.test(cleaned)) return false;

    if (this.uf && !this.validateUfSpecific(cleaned, this.uf)) {
      return false;
    }

    return true;
  }

  private validateUfSpecific(rg: string, uf: string): boolean {
    const ufUpper = uf.toUpperCase();

    if (ufUpper === RG_CONSTANTS.UF_SP) {
      return this.validateSpRg(rg);
    }

    if (ufUpper === RG_CONSTANTS.UF_RJ) {
      return this.validateRjRg(rg);
    }

    if (ufUpper === RG_CONSTANTS.UF_MG) {
      return this.validateMgRg(rg);
    }

    return true;
  }

  private validateSpRg(rg: string): boolean {
    if (rg.length !== RG_CONSTANTS.MAX_LENGTH) return false;

    let sum = RG_CONSTANTS.ZERO;

    for (
      let i = RG_CONSTANTS.LOOP_START;
      i < RG_CONSTANTS.SP_BASE_LENGTH;
      i++
    ) {
      sum += parseInt(rg[i]) * RG_CONSTANTS.SP_WEIGHTS[i];
    }

    const remainder = sum % RG_CONSTANTS.MODULUS;
    const digit =
      remainder < RG_CONSTANTS.REMAINDER_THRESHOLD
        ? RG_CONSTANTS.ZERO
        : RG_CONSTANTS.MODULUS - remainder;

    return digit === parseInt(rg[RG_CONSTANTS.CHECK_DIGIT_POS]);
  }

  private validateRjRg(rg: string): boolean {
    if (rg.length !== RG_CONSTANTS.MEDIUM_LENGTH) return true;

    let sum = RG_CONSTANTS.ZERO;

    for (
      let i = RG_CONSTANTS.LOOP_START;
      i < RG_CONSTANTS.RJ_BASE_LENGTH;
      i++
    ) {
      sum += parseInt(rg[i]) * RG_CONSTANTS.RJ_WEIGHTS[i];
    }

    const remainder = sum % RG_CONSTANTS.MODULUS;
    const digit =
      remainder < RG_CONSTANTS.REMAINDER_THRESHOLD
        ? RG_CONSTANTS.ZERO
        : RG_CONSTANTS.MODULUS - remainder;

    return digit === parseInt(rg[RG_CONSTANTS.RJ_CHECK_DIGIT_POS]);
  }

  private validateMgRg(rg: string): boolean {
    if (rg.length !== RG_CONSTANTS.MAX_LENGTH) return true;

    let sum = RG_CONSTANTS.ZERO;

    for (
      let i = RG_CONSTANTS.LOOP_START;
      i < RG_CONSTANTS.MG_BASE_LENGTH;
      i++
    ) {
      sum += parseInt(rg[i]) * RG_CONSTANTS.MG_WEIGHTS[i];
    }

    const remainder = sum % RG_CONSTANTS.MODULUS;
    const digit =
      remainder < RG_CONSTANTS.REMAINDER_THRESHOLD
        ? RG_CONSTANTS.ZERO
        : RG_CONSTANTS.MODULUS - remainder;

    return digit === parseInt(rg[RG_CONSTANTS.CHECK_DIGIT_POS]);
  }
}
