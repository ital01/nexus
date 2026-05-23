import { ValueObject } from '../base';

const STATE_CONSTANTS = {
  EMPTY_STRING: '',
  VALID_UFS: [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ] as const,
  EXPECTED_LENGTH: 2,
  UPPERCASE_REGEX: /^[A-Z]{2}$/,
} as const;

export class State implements ValueObject {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static from(value: string): State {
    return new State(value);
  }

  public isValid(): boolean {
    return this.validateState(this.value);
  }

  public isEmpty(): boolean {
    return !this.value || this.value.trim().length === 0;
  }

  public clean(): string {
    return this.value.trim().toUpperCase();
  }

  public format(): string {
    return this.clean();
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: State): boolean {
    return this.clean() === other.clean();
  }

  private validateState(state: string): boolean {
    if (!state || state.trim().length === 0) return false;

    const cleaned = this.clean();

    if (cleaned.length !== STATE_CONSTANTS.EXPECTED_LENGTH) return false;

    if (!STATE_CONSTANTS.UPPERCASE_REGEX.test(cleaned)) return false;

    return STATE_CONSTANTS.VALID_UFS.includes(
      cleaned as (typeof STATE_CONSTANTS.VALID_UFS)[number],
    );
  }
}
