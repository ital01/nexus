import {
  HTTP_METHODS,
  HTTP_DEFAULT_TIMEOUT,
  HTTP_ERROR_NAMES,
} from './constants/http.constants';
import {
  HttpClientError,
  HttpTimeoutError,
  HttpUnexpectedError,
  HttpParseError,
} from './error/http-client.error';
import { HttpMethod } from './types/http.types';

export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: HeadersInit;
}

export interface RequestConfig<P extends object = object> extends RequestInit {
  params?: P;
  method?: HttpMethod;
}

type HttpMethodConfig<P extends object = object> = Omit<
  RequestConfig<P>,
  'method'
>;

export type HttpResponse<T> = [T, null] | [null, HttpClientError];

export class HttpClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly headers: HeadersInit;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.timeout = config.timeout || HTTP_DEFAULT_TIMEOUT;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private buildUrl<P extends object = object>(
    endpoint: string,
    params?: P,
  ): string {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private createTimeoutController(): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller;
  }

  private isError(error: unknown): error is Error {
    return error instanceof Error;
  }

  private async request<T, P extends object = object>(
    endpoint: string,
    config: RequestConfig<P> = {},
  ): Promise<HttpResponse<T>> {
    const { params, ...fetchConfig } = config;
    const url = this.buildUrl(endpoint, params);
    const controller = this.createTimeoutController();
    const headers = { ...this.headers, ...fetchConfig.headers };

    const meta = {
      layer: HttpClient.name,
      functionName: `${HttpClient.name}->${fetchConfig?.method || 'request'}`,
    };

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
        headers,
      });

      let body: unknown;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        try {
          body = await response.json();
        } catch (error) {
          const originalError = this.isError(error)
            ? error
            : new Error(String(error));
          return [
            null,
            new HttpParseError(originalError, response.clone(), meta),
          ];
        }
      } else {
        body = await response.text();
      }

      if (!response.ok) {
        return [
          null,
          new HttpClientError(
            `Request failed with status ${response.status}: ${response.statusText}`,
            { ...meta, response: response.clone() },
          ),
        ];
      }

      return [body as T, null];
    } catch (error: unknown) {
      if (this.isError(error) && error.name === HTTP_ERROR_NAMES.ABORT) {
        return [null, new HttpTimeoutError(meta)];
      }

      if (error instanceof HttpClientError) {
        return [null, error];
      }

      const originalError = this.isError(error)
        ? error
        : new Error(String(error));
      return [null, new HttpUnexpectedError(originalError, meta)];
    }
  }

  public async GET<T, P extends object = object>(
    endpoint: string,
    config: HttpMethodConfig<P> = {},
  ): Promise<HttpResponse<T>> {
    return await this.request<T, P>(endpoint, {
      ...config,
      method: HTTP_METHODS.GET,
    });
  }

  public async POST<T, P extends object = object>(
    endpoint: string,
    config: HttpMethodConfig<P> = {},
  ): Promise<HttpResponse<T>> {
    return await this.request<T, P>(endpoint, {
      ...config,
      method: HTTP_METHODS.POST,
    });
  }

  public async PUT<T, P extends object = object>(
    endpoint: string,
    config: HttpMethodConfig<P> = {},
  ): Promise<HttpResponse<T>> {
    return await this.request<T, P>(endpoint, {
      ...config,
      method: HTTP_METHODS.PUT,
    });
  }

  public async DELETE<T, P extends object = object>(
    endpoint: string,
    config: HttpMethodConfig<P> = {},
  ): Promise<HttpResponse<T>> {
    return await this.request<T, P>(endpoint, {
      ...config,
      method: HTTP_METHODS.DELETE,
    });
  }

  public async PATCH<T, P extends object = object>(
    endpoint: string,
    config: HttpMethodConfig<P> = {},
  ): Promise<HttpResponse<T>> {
    return await this.request<T, P>(endpoint, {
      ...config,
      method: HTTP_METHODS.PATCH,
    });
  }

  public async HEAD<T, P extends object = object>(
    endpoint: string,
    config: HttpMethodConfig<P> = {},
  ): Promise<HttpResponse<T>> {
    return await this.request<T, P>(endpoint, {
      ...config,
      method: HTTP_METHODS.HEAD,
    });
  }

  public async OPTIONS<T, P extends object = object>(
    endpoint: string,
    config: HttpMethodConfig<P> = {},
  ): Promise<HttpResponse<T>> {
    return await this.request<T, P>(endpoint, {
      ...config,
      method: HTTP_METHODS.OPTIONS,
    });
  }
}
