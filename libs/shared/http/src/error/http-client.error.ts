import {
  HTTP_STATUS,
  HTTP_STATUS_GROUP,
  HTTP_STATUS_TEXT,
} from '../constants/http.constants';

export interface HttpClientErrorMetadata {
  layer: string;
  functionName: string;
}

export interface HttpClientErrorDetails extends HttpClientErrorMetadata {
  response?: Response;
}

export class HttpClientError extends Error {
  public override readonly name: string;
  public readonly details: HttpClientErrorDetails;

  constructor(
    message: string,
    details: HttpClientErrorDetails,
    originalError?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;

    if (originalError?.stack) {
      this.stack = originalError.stack;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class HttpTimeoutError extends HttpClientError {
  constructor(meta: HttpClientErrorMetadata) {
    const mockResponse = new Response(null, {
      status: HTTP_STATUS[HTTP_STATUS_GROUP.CLIENT_ERROR].REQUEST_TIMEOUT,
      statusText:
        HTTP_STATUS_TEXT[HTTP_STATUS_GROUP.CLIENT_ERROR][
          HTTP_STATUS[HTTP_STATUS_GROUP.CLIENT_ERROR].REQUEST_TIMEOUT
        ],
    });
    super('Request timeout', { ...meta, response: mockResponse });
  }
}

export class HttpUnexpectedError extends HttpClientError {
  constructor(originalError: Error, meta: HttpClientErrorMetadata) {
    const mockResponse = new Response(null, {
      status: HTTP_STATUS[HTTP_STATUS_GROUP.SERVER_ERROR].INTERNAL_SERVER_ERROR,
      statusText:
        HTTP_STATUS_TEXT[HTTP_STATUS_GROUP.SERVER_ERROR][
          HTTP_STATUS[HTTP_STATUS_GROUP.SERVER_ERROR].INTERNAL_SERVER_ERROR
        ],
    });
    super(
      originalError.message || 'Unexpected error',
      { ...meta, response: mockResponse },
      originalError,
    );
  }
}

export class HttpParseError extends HttpClientError {
  constructor(
    originalError: Error,
    response: Response,
    meta: HttpClientErrorMetadata,
  ) {
    super(
      `Failed to parse response body: ${originalError.message}`,
      { ...meta, response },
      originalError,
    );
  }
}
