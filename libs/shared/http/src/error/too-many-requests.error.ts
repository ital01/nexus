import {
  HTTP_STATUS,
  HTTP_STATUS_GROUP,
  HTTP_STATUS_TEXT,
} from '../constants/http.constants';
import { HttpClientError, HttpClientErrorMetadata } from './http-client.error';

export class TooManyRequestsError extends HttpClientError {
  constructor(message?: string, meta?: HttpClientErrorMetadata) {
    const mockResponse = new Response(null, {
      status: HTTP_STATUS[HTTP_STATUS_GROUP.CLIENT_ERROR].TOO_MANY_REQUESTS,
      statusText:
        HTTP_STATUS_TEXT[HTTP_STATUS_GROUP.CLIENT_ERROR][
          HTTP_STATUS[HTTP_STATUS_GROUP.CLIENT_ERROR].TOO_MANY_REQUESTS
        ],
    });
    super(
      message || 'Too Many Requests',
      {
        layer: meta?.layer || 'HttpClient',
        functionName: meta?.functionName || 'TooManyRequestsError',
        response: mockResponse,
      },
    );
  }
}
