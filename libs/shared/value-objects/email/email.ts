import { ValueObject } from '../base';

const EMAIL_CONSTANTS = {
  AT_SYMBOL: '@',
  DOT_SYMBOL: '.',
  EMPTY_STRING: '',
  EMAIL_REGEX:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  MAX_LOCAL_PART_LENGTH: 64,
  MAX_DOMAIN_LENGTH: 255,
  MIN_DOMAIN_PARTS: 2,
  MAX_LABEL_LENGTH: 61,
  NOT_FOUND_INDEX: -1,
  EXPECTED_PARTS_COUNT: 2,
  MIN_LENGTH: 0,
} as const;

interface IEmail {
  getDomain(): string;
  getLocalPart(): string;
}

export class Email implements ValueObject, IEmail {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): Email {
    return new Email(value);
  }

  public isValid(): boolean {
    return this.validateEmail(this.value);
  }

  public isEmpty(): boolean {
    return (
      !this.value || this.value.trim().length === EMAIL_CONSTANTS.MIN_LENGTH
    );
  }

  public clean(): string {
    return this.value.trim().toLowerCase();
  }

  public format(): string {
    return this.clean();
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.format() === other.format();
  }

  public getDomain(): string {
    const cleaned = this.clean();
    const atIndex = cleaned.lastIndexOf(EMAIL_CONSTANTS.AT_SYMBOL);
    if (atIndex === EMAIL_CONSTANTS.NOT_FOUND_INDEX)
      return EMAIL_CONSTANTS.EMPTY_STRING;
    return cleaned.substring(atIndex + 1);
  }

  public getLocalPart(): string {
    const cleaned = this.clean();
    const atIndex = cleaned.lastIndexOf(EMAIL_CONSTANTS.AT_SYMBOL);
    if (atIndex === EMAIL_CONSTANTS.NOT_FOUND_INDEX) return cleaned;
    return cleaned.substring(0, atIndex);
  }

  private validateEmail(email: string): boolean {
    if (!email || email.trim().length === EMAIL_CONSTANTS.MIN_LENGTH)
      return false;

    if (!EMAIL_CONSTANTS.EMAIL_REGEX.test(email)) return false;

    const parts = email.split(EMAIL_CONSTANTS.AT_SYMBOL);
    if (parts.length !== EMAIL_CONSTANTS.EXPECTED_PARTS_COUNT) return false;

    const [localPart, domain] = parts;
    if (
      localPart.length === EMAIL_CONSTANTS.MIN_LENGTH ||
      domain.length === EMAIL_CONSTANTS.MIN_LENGTH
    )
      return false;

    if (localPart.length > EMAIL_CONSTANTS.MAX_LOCAL_PART_LENGTH) return false;
    if (domain.length > EMAIL_CONSTANTS.MAX_DOMAIN_LENGTH) return false;

    const domainParts = domain.split(EMAIL_CONSTANTS.DOT_SYMBOL);
    if (domainParts.length < EMAIL_CONSTANTS.MIN_DOMAIN_PARTS) return false;

    if (domainParts.some((part) => part.length === EMAIL_CONSTANTS.MIN_LENGTH))
      return false;

    return true;
  }
}
