import { HttpClientError, HttpClientErrorDetails } from '@org/shared';

export class BrasilApiError extends HttpClientError {
  constructor(message: string, details: HttpClientErrorDetails) {
    super(message, details);
  }
}

export class CepNotFoundError extends BrasilApiError {
  constructor(cep: string, details: HttpClientErrorDetails) {
    super(`CEP ${cep} not found`, details);
  }
}

export class CepValidationError extends BrasilApiError {
  constructor(cep: string, reason: string, details: HttpClientErrorDetails) {
    super(`Invalid CEP ${cep}: ${reason}`, details);
  }
}

export class BrasilApiTimeoutError extends BrasilApiError {
  constructor(details: HttpClientErrorDetails) {
    super('Brasil API request timed out', details);
  }
}
