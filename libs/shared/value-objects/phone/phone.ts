import { ValueObject } from '../base';

const PHONE_CONSTANTS = {
  EMPTY_STRING: '',
  OPEN_PAREN: '(',
  CLOSE_PAREN: ')',
  SPACE: ' ',
  DASH: '-',
  COUNTRY_CODE: '+55',
  BRAZIL_CODE: '55',
  NON_DIGIT_REGEX: /\D/g,
  MOBILE_LENGTH: 11,
  LANDLINE_LENGTH: 10,
  INTERNATIONAL_LENGTH: 13,
  AREA_CODE_LENGTH: 2,
  MOBILE_NUMBER_START: 7,
  LANDLINE_NUMBER_START: 6,
  MIN_DDD: 11,
  MAX_DDD: 99,
  MIN_NUMBER_LENGTH: 8,
  ZERO_LENGTH: 0,
} as const;

interface IPhone {
  getCountryCode(): string;
  getAreaCode(): string;
  getNumber(): string;
  isMobile(): boolean;
  isLandline(): boolean;
}

export class Phone implements ValueObject, IPhone {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): Phone {
    return new Phone(value);
  }

  public isValid(): boolean {
    return this.validatePhone(this.value);
  }

  public isEmpty(): boolean {
    return (
      !this.value || this.value.trim().length === PHONE_CONSTANTS.ZERO_LENGTH
    );
  }

  public clean(): string {
    return this.value.replace(
      PHONE_CONSTANTS.NON_DIGIT_REGEX,
      PHONE_CONSTANTS.EMPTY_STRING,
    );
  }

  public format(): string {
    const cleaned = this.clean();
    if (cleaned.length === PHONE_CONSTANTS.MOBILE_LENGTH) {
      return `${PHONE_CONSTANTS.OPEN_PAREN}${cleaned.substring(0, PHONE_CONSTANTS.AREA_CODE_LENGTH)}${PHONE_CONSTANTS.CLOSE_PAREN}${PHONE_CONSTANTS.SPACE}${cleaned.substring(PHONE_CONSTANTS.AREA_CODE_LENGTH, PHONE_CONSTANTS.MOBILE_NUMBER_START)}${PHONE_CONSTANTS.DASH}${cleaned.substring(PHONE_CONSTANTS.MOBILE_NUMBER_START)}`;
    }
    if (cleaned.length === PHONE_CONSTANTS.LANDLINE_LENGTH) {
      return `${PHONE_CONSTANTS.OPEN_PAREN}${cleaned.substring(0, PHONE_CONSTANTS.AREA_CODE_LENGTH)}${PHONE_CONSTANTS.CLOSE_PAREN}${PHONE_CONSTANTS.SPACE}${cleaned.substring(PHONE_CONSTANTS.AREA_CODE_LENGTH, PHONE_CONSTANTS.LANDLINE_NUMBER_START)}${PHONE_CONSTANTS.DASH}${cleaned.substring(PHONE_CONSTANTS.LANDLINE_NUMBER_START)}`;
    }
    return this.value;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Phone): boolean {
    return this.clean() === other.clean();
  }

  public getCountryCode(): string {
    const cleaned = this.clean();
    if (
      cleaned.length >= PHONE_CONSTANTS.INTERNATIONAL_LENGTH &&
      cleaned.startsWith(PHONE_CONSTANTS.BRAZIL_CODE)
    ) {
      return PHONE_CONSTANTS.COUNTRY_CODE;
    }
    return PHONE_CONSTANTS.COUNTRY_CODE;
  }

  public getAreaCode(): string {
    const cleaned = this.clean();
    if (cleaned.length >= PHONE_CONSTANTS.LANDLINE_LENGTH) {
      return cleaned.substring(0, PHONE_CONSTANTS.AREA_CODE_LENGTH);
    }
    return PHONE_CONSTANTS.EMPTY_STRING;
  }

  public getNumber(): string {
    const cleaned = this.clean();
    if (cleaned.length >= PHONE_CONSTANTS.LANDLINE_LENGTH) {
      return cleaned.substring(PHONE_CONSTANTS.AREA_CODE_LENGTH);
    }
    return cleaned;
  }

  public isMobile(): boolean {
    const cleaned = this.clean();
    return cleaned.length === PHONE_CONSTANTS.MOBILE_LENGTH;
  }

  public isLandline(): boolean {
    const cleaned = this.clean();
    return cleaned.length === PHONE_CONSTANTS.LANDLINE_LENGTH;
  }

  private validatePhone(phone: string): boolean {
    if (!phone || phone.trim().length === PHONE_CONSTANTS.ZERO_LENGTH)
      return false;

    const cleaned = this.clean();

    if (
      cleaned.length !== PHONE_CONSTANTS.LANDLINE_LENGTH &&
      cleaned.length !== PHONE_CONSTANTS.MOBILE_LENGTH
    )
      return false;

    const ddd = parseInt(
      cleaned.substring(0, PHONE_CONSTANTS.AREA_CODE_LENGTH),
    );
    if (
      isNaN(ddd) ||
      ddd < PHONE_CONSTANTS.MIN_DDD ||
      ddd > PHONE_CONSTANTS.MAX_DDD
    )
      return false;

    if (
      cleaned.substring(PHONE_CONSTANTS.AREA_CODE_LENGTH).length <
      PHONE_CONSTANTS.MIN_NUMBER_LENGTH
    )
      return false;

    return true;
  }
}
