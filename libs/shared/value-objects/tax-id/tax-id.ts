import { ValueObject } from '../base';
import { Cpf } from './cpf';
import { Cnpj } from './cnpj';

const TAX_ID_CONSTANTS = {
  TYPE_CPF: 'CPF' as const,
  TYPE_CNPJ: 'CNPJ' as const,
  TYPE_UNKNOWN: 'UNKNOWN' as const,
  NON_DIGIT_REGEX: /\D/g,
  ZERO_LENGTH: 0,
} as const;

interface ITaxId {
  getType():
    | typeof TAX_ID_CONSTANTS.TYPE_CPF
    | typeof TAX_ID_CONSTANTS.TYPE_CNPJ
    | typeof TAX_ID_CONSTANTS.TYPE_UNKNOWN;
  getCpf(): Cpf | null;
  getCnpj(): Cnpj | null;
}

export class TaxId implements ValueObject, ITaxId {
  private value: string;
  private cpf: Cpf | null;
  private cnpj: Cnpj | null;

  private constructor(value: string) {
    this.value = value;
    this.cpf = this.tryParseCpf(value);
    this.cnpj = this.tryParseCnpj(value);
  }

  public static from(value: string): TaxId {
    return new TaxId(value);
  }

  public static fromCpf(cpf: string): TaxId {
    return new TaxId(cpf);
  }

  public static fromCnpj(cnpj: string): TaxId {
    return new TaxId(cnpj);
  }

  public isValid(): boolean {
    return (this.cpf?.isValid() ?? false) || (this.cnpj?.isValid() ?? false);
  }

  public isEmpty(): boolean {
    return (
      !this.value || this.value.trim().length === TAX_ID_CONSTANTS.ZERO_LENGTH
    );
  }

  public clean(): string {
    return this.value.replace(TAX_ID_CONSTANTS.NON_DIGIT_REGEX, '');
  }

  public format(): string {
    if (this.cpf?.isValid()) {
      return this.cpf.format();
    }
    if (this.cnpj?.isValid()) {
      return this.cnpj.format();
    }
    return this.value;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: TaxId): boolean {
    return this.clean() === other.clean();
  }

  public getType(): 'CPF' | 'CNPJ' | 'UNKNOWN' {
    if (this.cpf?.isValid()) return TAX_ID_CONSTANTS.TYPE_CPF;
    if (this.cnpj?.isValid()) return TAX_ID_CONSTANTS.TYPE_CNPJ;
    return TAX_ID_CONSTANTS.TYPE_UNKNOWN;
  }

  public getCpf(): Cpf | null {
    return this.cpf?.isValid() ? this.cpf : null;
  }

  public getCnpj(): Cnpj | null {
    return this.cnpj?.isValid() ? this.cnpj : null;
  }

  private tryParseCpf(value: string): Cpf | null {
    const cpf = Cpf.from(value);
    return cpf.isValid() ? cpf : null;
  }

  private tryParseCnpj(value: string): Cnpj | null {
    const cnpj = Cnpj.from(value);
    return cnpj.isValid() ? cnpj : null;
  }
}
