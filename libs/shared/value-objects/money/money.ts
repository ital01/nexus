import { ValueObject } from '../base';

const MONEY_CONSTANTS = {
  DEFAULT_CURRENCY: 'BRL',
  DECIMAL_SEPARATOR_STRING: ',',
  DECIMAL_SEPARATOR_NUMBER: '.',
  DECIMAL_PLACES: 2,
  THOUSANDS_SEPARATOR: '.',
  THOUSANDS_GROUP_SIZE: 3,
  ZERO_VALUE: 0,
  ERROR_DIFFERENT_CURRENCIES: 'Cannot add money with different currencies',
  ERROR_DIFFERENT_CURRENCIES_SUBTRACT:
    'Cannot subtract money with different currencies',
  ERROR_DIVIDE_BY_ZERO: 'Cannot divide by zero',
  CURRENCY_SYMBOLS: {
    BRL: 'R$',
    USD: 'US$',
    EUR: '€',
    GBP: '£',
  } as const,
} as const;

interface IMoney {
  getAmount(): number;
  getCurrency(): string;
  add(other: Money): Money;
  subtract(other: Money): Money;
  multiply(factor: number): Money;
  divide(divisor: number): Money;
  toFormattedString(): string;
}

export class Money implements ValueObject, IMoney {
  private value: number;
  private currency: string;

  private constructor(
    value: number,
    currency: string = MONEY_CONSTANTS.DEFAULT_CURRENCY,
  ) {
    this.value = value;
    this.currency = currency;
  }

  public static from(
    value: number,
    currency: string = MONEY_CONSTANTS.DEFAULT_CURRENCY,
  ): Money {
    return new Money(value, currency);
  }

  public static fromString(
    value: string,
    currency: string = MONEY_CONSTANTS.DEFAULT_CURRENCY,
  ): Money {
    const numValue = parseFloat(
      value.replace(
        MONEY_CONSTANTS.DECIMAL_SEPARATOR_STRING,
        MONEY_CONSTANTS.DECIMAL_SEPARATOR_NUMBER,
      ),
    );
    return new Money(numValue, currency);
  }

  public isValid(): boolean {
    return !isNaN(this.value) && this.value >= MONEY_CONSTANTS.ZERO_VALUE;
  }

  public isEmpty(): boolean {
    return this.value === MONEY_CONSTANTS.ZERO_VALUE;
  }

  public clean(): string {
    return this.value.toString();
  }

  public format(): string {
    return this.toFormattedString();
  }

  public getValue(): string {
    return this.value.toString();
  }

  public equals(other: Money): boolean {
    return this.value === other.value && this.currency === other.currency;
  }

  public getAmount(): number {
    return this.value;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(MONEY_CONSTANTS.ERROR_DIFFERENT_CURRENCIES);
    }
    return new Money(this.value + other.value, this.currency);
  }

  public subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(MONEY_CONSTANTS.ERROR_DIFFERENT_CURRENCIES_SUBTRACT);
    }
    return new Money(this.value - other.value, this.currency);
  }

  public multiply(factor: number): Money {
    return new Money(this.value * factor, this.currency);
  }

  public divide(divisor: number): Money {
    if (divisor === MONEY_CONSTANTS.ZERO_VALUE) {
      throw new Error(MONEY_CONSTANTS.ERROR_DIVIDE_BY_ZERO);
    }
    return new Money(this.value / divisor, this.currency);
  }

  public toFormattedString(): string {
    const formatted = this.value.toFixed(MONEY_CONSTANTS.DECIMAL_PLACES);
    const parts = formatted.split(MONEY_CONSTANTS.DECIMAL_SEPARATOR_NUMBER);
    parts[0] = parts[0].replace(
      new RegExp(
        `\\B(?=(\\d{${MONEY_CONSTANTS.THOUSANDS_GROUP_SIZE}})+(? !\\d))`,
        'g',
      ),
      MONEY_CONSTANTS.THOUSANDS_SEPARATOR,
    );

    const symbol =
      MONEY_CONSTANTS.CURRENCY_SYMBOLS[
        this.currency as keyof typeof MONEY_CONSTANTS.CURRENCY_SYMBOLS
      ] || this.currency;
    return `${symbol} ${parts.join(MONEY_CONSTANTS.DECIMAL_SEPARATOR_STRING)}`;
  }
}
