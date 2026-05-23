import {
  HTTP_STATUS,
  HTTP_STATUS_GROUP,
  HTTP_STATUS_TEXT,
} from '../constants/http.constants';
import { HttpClientError, HttpClientErrorMetadata } from './http-client.error';

export class ServiceUnavailableError extends HttpClientError {
  constructor(message?: string, meta?: HttpClientErrorMetadata) {
    const mockResponse = new Response(null, {
      status: HTTP_STATUS[HTTP_STATUS_GROUP.SERVER_ERROR].SERVICE_UNAVAILABLE,
      statusText:
        HTTP_STATUS_TEXT[HTTP_STATUS_GROUP.SERVER_ERROR][
          HTTP_STATUS[HTTP_STATUS_GROUP.SERVER_ERROR].SERVICE_UNAVAILABLE
        ],
    });
    super(
      message || 'Service Unavailable',
      {
        layer: meta?.layer || 'HttpClient',
        functionName: meta?.functionName || 'ServiceUnavailableError',
        response: mockResponse,
      },
    );
  }
}
