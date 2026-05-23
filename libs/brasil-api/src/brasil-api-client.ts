import {
  HttpClient,
  HttpClientError,
  HttpClientErrorDetails,
} from '@org/shared';
import { BRASIL_API_CONSTANTS } from './constants/brasil-api.constants';
import { AddressV1, AddressV2 } from './types/cep.types';
import {
  BrasilApiError,
  CepNotFoundError,
  CepValidationError,
  BrasilApiTimeoutError,
} from './errors/brasil-api.error';

export class BrasilApiClient {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({
      baseUrl: BRASIL_API_CONSTANTS.BASE_URL,
      timeout: BRASIL_API_CONSTANTS.DEFAULT_TIMEOUT,
    });
  }

  private transformError(error: HttpClientError, cep: string): BrasilApiError {
    const meta: HttpClientErrorDetails = {
      layer: 'BrasilApiClient',
      functionName: 'BrasilApiClient',
      response: error.details.response,
    };

    if (error.name === 'HttpTimeoutError') {
      return new BrasilApiTimeoutError(meta);
    }

    if (error.details.response?.status === 404) {
      return new CepNotFoundError(cep, meta);
    }

    if (error.details.response?.status === 400) {
      return new CepValidationError(cep, 'Invalid format', meta);
    }

    return new BrasilApiError(error.message, meta);
  }

  public async getCepV1(cep: string) {
    const cleanedCep = cep.replace(/\D/g, '');
    const endpoint = `${BRASIL_API_CONSTANTS.CEP_V1_ENDPOINT}/${cleanedCep}`;
    const [data, error] = await this.httpClient.GET<AddressV1>(endpoint);

    if (error) {
      return [null, this.transformError(error, cleanedCep)];
    }

    return [data, null];
  }

  public async getCepV2(cep: string) {
    const cleanedCep = cep.replace(/\D/g, '');
    const endpoint = `${BRASIL_API_CONSTANTS.CEP_V2_ENDPOINT}/${cleanedCep}`;
    const [data, error] = await this.httpClient.GET<AddressV2>(endpoint);

    if (error) {
      return [null, this.transformError(error, cleanedCep)];
    }

    return [data, null];
  }
}
