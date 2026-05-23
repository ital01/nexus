export interface ValueObject {
  isValid(): boolean;
  isEmpty(): boolean;
  clean(): string;
  format(): string;
  getValue(): string;
  equals(other: this): boolean;
}
