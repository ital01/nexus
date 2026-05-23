import { ValueObject } from '../base';

const DATE_CONSTANTS = {
  FALLBACK_DATE: '1970-01-01',
  MIDNIGHT_TIME: '00:00:00',
  UTC_TIMEZONE: 'UTC',
  DATE_SEPARATOR: '/',
  PAD_CHAR: '0',
  PAD_LENGTH: 2,
  ZERO_LENGTH: 0,
  COMPARE_LESS_THAN: 0,
  COMPARE_GREATER_THAN: 0,
  MONTH_OFFSET: 1,
} as const;

interface IDate {
  toPlainDate(): Temporal.PlainDate;
  toInstant(): Temporal.Instant;
  add(duration: Temporal.Duration): DateValue;
  subtract(duration: Temporal.Duration): DateValue;
  addDays(days: number): DateValue;
  subtractDays(days: number): DateValue;
  addMonths(months: number): DateValue;
  subtractMonths(months: number): DateValue;
  addYears(years: number): DateValue;
  subtractYears(years: number): DateValue;
  until(other: DateValue): Temporal.Duration;
  since(other: DateValue): Temporal.Duration;
  isBefore(other: DateValue): boolean;
  isAfter(other: DateValue): boolean;
  equals(other: DateValue): boolean;
  isToday(): boolean;
  getAge(): number;
  getYear(): number;
  getMonth(): number;
  getDay(): number;
  getDayOfWeek(): number;
}

export class DateValue implements ValueObject, IDate {
  private value: string;
  private plainDate: Temporal.PlainDate;

  private constructor(value: string, plainDate: Temporal.PlainDate) {
    this.value = value;
    this.plainDate = plainDate;
  }

  public static from(value: string): DateValue {
    try {
      const plainDate = Temporal.PlainDate.from(value);
      return new DateValue(value, plainDate);
    } catch {
      const legacyDate = new Date(value);
      if (isNaN(legacyDate.getTime())) {
        return new DateValue(
          value,
          Temporal.PlainDate.from(DATE_CONSTANTS.FALLBACK_DATE),
        );
      }
      const plainDate = Temporal.PlainDate.from({
        year: legacyDate.getFullYear(),
        month: legacyDate.getMonth() + DATE_CONSTANTS.MONTH_OFFSET,
        day: legacyDate.getDate(),
      });
      return new DateValue(value, plainDate);
    }
  }

  public static fromPlainDate(plainDate: Temporal.PlainDate): DateValue {
    return new DateValue(plainDate.toString(), plainDate);
  }

  public static now(): DateValue {
    const now = Temporal.Now.plainDateISO();
    return new DateValue(now.toString(), now);
  }

  public isValid(): boolean {
    return this.validateDate(this.value);
  }

  public isEmpty(): boolean {
    return (
      !this.value || this.value.trim().length === DATE_CONSTANTS.ZERO_LENGTH
    );
  }

  public clean(): string {
    return this.value.trim();
  }

  public format(): string {
    const day = this.plainDate.day
      .toString()
      .padStart(DATE_CONSTANTS.PAD_LENGTH, DATE_CONSTANTS.PAD_CHAR);
    const month = this.plainDate.month
      .toString()
      .padStart(DATE_CONSTANTS.PAD_LENGTH, DATE_CONSTANTS.PAD_CHAR);
    const year = this.plainDate.year;
    return `${day}${DATE_CONSTANTS.DATE_SEPARATOR}${month}${DATE_CONSTANTS.DATE_SEPARATOR}${year}`;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: DateValue): boolean {
    return this.plainDate.equals(other.plainDate);
  }

  public toPlainDate(): Temporal.PlainDate {
    return this.plainDate;
  }

  public toInstant(): Temporal.Instant {
    return this.plainDate
      .toPlainDateTime(DATE_CONSTANTS.MIDNIGHT_TIME)
      .toZonedDateTime(DATE_CONSTANTS.UTC_TIMEZONE)
      .toInstant();
  }

  public add(duration: Temporal.Duration): DateValue {
    const newPlainDate = this.plainDate.add(duration);
    return new DateValue(newPlainDate.toString(), newPlainDate);
  }

  public subtract(duration: Temporal.Duration): DateValue {
    const newPlainDate = this.plainDate.subtract(duration);
    return new DateValue(newPlainDate.toString(), newPlainDate);
  }

  public addDays(days: number): DateValue {
    const duration = Temporal.Duration.from({ days });
    return this.add(duration);
  }

  public subtractDays(days: number): DateValue {
    const duration = Temporal.Duration.from({ days: -days });
    return this.add(duration);
  }

  public addMonths(months: number): DateValue {
    const duration = Temporal.Duration.from({ months });
    return this.add(duration);
  }

  public subtractMonths(months: number): DateValue {
    const duration = Temporal.Duration.from({ months: -months });
    return this.add(duration);
  }

  public addYears(years: number): DateValue {
    const duration = Temporal.Duration.from({ years });
    return this.add(duration);
  }

  public subtractYears(years: number): DateValue {
    const duration = Temporal.Duration.from({ years: -years });
    return this.add(duration);
  }

  public until(other: DateValue): Temporal.Duration {
    return this.plainDate.until(other.plainDate);
  }

  public since(other: DateValue): Temporal.Duration {
    return this.plainDate.since(other.plainDate);
  }

  public isBefore(other: DateValue): boolean {
    return (
      Temporal.PlainDate.compare(this.plainDate, other.plainDate) <
      DATE_CONSTANTS.COMPARE_LESS_THAN
    );
  }

  public isAfter(other: DateValue): boolean {
    return (
      Temporal.PlainDate.compare(this.plainDate, other.plainDate) >
      DATE_CONSTANTS.COMPARE_GREATER_THAN
    );
  }

  public isToday(): boolean {
    const today = Temporal.Now.plainDateISO();
    return this.plainDate.equals(today);
  }

  public getAge(): number {
    const today = DateValue.now();
    const duration = this.until(today);
    return duration.years;
  }

  public getYear(): number {
    return this.plainDate.year;
  }

  public getMonth(): number {
    return this.plainDate.month;
  }

  public getDay(): number {
    return this.plainDate.day;
  }

  public getDayOfWeek(): number {
    return this.plainDate.dayOfWeek;
  }

  private validateDate(date: string): boolean {
    if (!date || date.trim().length === DATE_CONSTANTS.ZERO_LENGTH)
      return false;

    try {
      Temporal.PlainDate.from(date);
      return true;
    } catch {
      const legacyDate = new Date(date);
      return !isNaN(legacyDate.getTime());
    }
  }
}
