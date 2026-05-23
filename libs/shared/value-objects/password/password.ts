import { ValueObject } from '../base';

const PASSWORD_CONSTANTS = {
  MASK_CHAR: '*',
  MIN_LENGTH: 8,
  MEDIUM_LENGTH: 12,
  LONG_LENGTH: 16,
  SCORE_LENGTH_8: 10,
  SCORE_LENGTH_12: 10,
  SCORE_LENGTH_16: 10,
  SCORE_LOWERCASE: 10,
  SCORE_UPPERCASE: 10,
  SCORE_DIGIT: 10,
  SCORE_SPECIAL: 15,
  SCORE_MIXED_CASE: 10,
  SCORE_MIXED_ALPHA_DIGIT: 10,
  SCORE_MIXED_ALPHA_SPECIAL: 15,
  MAX_SCORE: 100,
  ZERO_SCORE: 0,
  HASH_SHIFT: 5,
  HASH_BASE: 16,
  WEAK_THRESHOLD: 40,
  MEDIUM_THRESHOLD: 80,
  REGEX_LOWERCASE: /[a-z]/,
  REGEX_UPPERCASE: /[A-Z]/,
  REGEX_DIGIT: /[0-9]/,
  REGEX_SPECIAL: /[^a-zA-Z0-9]/,
  REGEX_MIXED_CASE: /[a-z].*[A-Z]|[A-Z].*[a-z]/,
  REGEX_MIXED_ALPHA_DIGIT: /[a-zA-Z].*[0-9]|[0-9].*[a-zA-Z]/,
  REGEX_MIXED_ALPHA_SPECIAL:
    /[a-zA-Z0-9].*[^a-zA-Z0-9]|[^a-zA-Z0-9].*[a-zA-Z0-9]/,
  STRENGTH_WEAK: 'weak' as const,
  STRENGTH_MEDIUM: 'medium' as const,
  STRENGTH_STRONG: 'strong' as const,
} as const;

interface IPassword {
  getStrength():
    | typeof PASSWORD_CONSTANTS.STRENGTH_WEAK
    | typeof PASSWORD_CONSTANTS.STRENGTH_MEDIUM
    | typeof PASSWORD_CONSTANTS.STRENGTH_STRONG;
  getStrengthScore(): number;
  hash(): string;
}

export class Password implements ValueObject, IPassword {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): Password {
    return new Password(value);
  }

  public isValid(): boolean {
    return this.validatePassword(this.value);
  }

  public isEmpty(): boolean {
    return !this.value || this.value.length === PASSWORD_CONSTANTS.ZERO_SCORE;
  }

  public clean(): string {
    return this.value;
  }

  public format(): string {
    return PASSWORD_CONSTANTS.MASK_CHAR.repeat(this.value.length);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Password): boolean {
    return this.value === other.value;
  }

  public getStrength(): 'weak' | 'medium' | 'strong' {
    const score = this.getStrengthScore();
    if (score < PASSWORD_CONSTANTS.WEAK_THRESHOLD)
      return PASSWORD_CONSTANTS.STRENGTH_WEAK;
    if (score < PASSWORD_CONSTANTS.MEDIUM_THRESHOLD)
      return PASSWORD_CONSTANTS.STRENGTH_MEDIUM;
    return PASSWORD_CONSTANTS.STRENGTH_STRONG;
  }

  public getStrengthScore(): number {
    let score = PASSWORD_CONSTANTS.ZERO_SCORE;

    if (!this.value) return PASSWORD_CONSTANTS.ZERO_SCORE;

    if (this.value.length >= PASSWORD_CONSTANTS.MIN_LENGTH)
      score += PASSWORD_CONSTANTS.SCORE_LENGTH_8;
    if (this.value.length >= PASSWORD_CONSTANTS.MEDIUM_LENGTH)
      score += PASSWORD_CONSTANTS.SCORE_LENGTH_12;
    if (this.value.length >= PASSWORD_CONSTANTS.LONG_LENGTH)
      score += PASSWORD_CONSTANTS.SCORE_LENGTH_16;

    if (PASSWORD_CONSTANTS.REGEX_LOWERCASE.test(this.value))
      score += PASSWORD_CONSTANTS.SCORE_LOWERCASE;
    if (PASSWORD_CONSTANTS.REGEX_UPPERCASE.test(this.value))
      score += PASSWORD_CONSTANTS.SCORE_UPPERCASE;
    if (PASSWORD_CONSTANTS.REGEX_DIGIT.test(this.value))
      score += PASSWORD_CONSTANTS.SCORE_DIGIT;
    if (PASSWORD_CONSTANTS.REGEX_SPECIAL.test(this.value))
      score += PASSWORD_CONSTANTS.SCORE_SPECIAL;

    if (PASSWORD_CONSTANTS.REGEX_MIXED_CASE.test(this.value))
      score += PASSWORD_CONSTANTS.SCORE_MIXED_CASE;
    if (PASSWORD_CONSTANTS.REGEX_MIXED_ALPHA_DIGIT.test(this.value))
      score += PASSWORD_CONSTANTS.SCORE_MIXED_ALPHA_DIGIT;
    if (PASSWORD_CONSTANTS.REGEX_MIXED_ALPHA_SPECIAL.test(this.value))
      score += PASSWORD_CONSTANTS.SCORE_MIXED_ALPHA_SPECIAL;

    return Math.min(score, PASSWORD_CONSTANTS.MAX_SCORE);
  }

  public hash(): string {
    let hash = 0;
    for (let i = 0; i < this.value.length; i++) {
      const char = this.value.charCodeAt(i);
      hash = (hash << PASSWORD_CONSTANTS.HASH_SHIFT) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(PASSWORD_CONSTANTS.HASH_BASE);
  }

  private validatePassword(password: string): boolean {
    if (!password || password.length < PASSWORD_CONSTANTS.MIN_LENGTH)
      return false;
    if (!PASSWORD_CONSTANTS.REGEX_LOWERCASE.test(password)) return false;
    if (!PASSWORD_CONSTANTS.REGEX_UPPERCASE.test(password)) return false;
    if (!PASSWORD_CONSTANTS.REGEX_DIGIT.test(password)) return false;
    return true;
  }
}
