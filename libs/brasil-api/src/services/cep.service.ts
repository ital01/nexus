import { BrasilApiClient } from '../brasil-api-client';
import { AddressV1 } from '../types/cep.types';

export class CepService {
  private client: BrasilApiClient;

  constructor() {
    this.client = new BrasilApiClient();
  }

  public async getAddress(cep: string) {
    return await this.client.getCepV1(cep);
  }

  public async getAddressWithGeolocation(cep: string) {
    return await this.client.getCepV2(cep);
  }

  public async getCity(cep: string) {
    const [address, error] = await this.getAddress(cep);
    if (error) return [null, error];
    return [(address as AddressV1).city, null];
  }

  public async getState(cep: string) {
    const [address, error] = await this.getAddress(cep);
    if (error) return [null, error];
    return [(address as AddressV1).state, null];
  }

  public async getStreet(cep: string) {
    const [address, error] = await this.getAddress(cep);
    if (error) return [null, error];
    return [(address as AddressV1).street, null];
  }

  public async getNeighborhood(cep: string) {
    const [address, error] = await this.getAddress(cep);
    if (error) return [null, error];
    return [(address as AddressV1).neighborhood, null];
  }
}
