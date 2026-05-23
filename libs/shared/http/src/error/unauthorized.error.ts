import {
  HTTP_STATUS,
  HTTP_STATUS_GROUP,
  HTTP_STATUS_TEXT,
} from '../constants/http.constants';
import { HttpClientError, HttpClientErrorMetadata } from './http-client.error';

export class UnauthorizedError extends HttpClientError {
  constructor(message?: string, meta?: HttpClientErrorMetadata) {
    const mockResponse = new Response(null, {
      status: HTTP_STATUS[HTTP_STATUS_GROUP.CLIENT_ERROR].UNAUTHORIZED,
      statusText:
        HTTP_STATUS_TEXT[HTTP_STATUS_GROUP.CLIENT_ERROR][
          HTTP_STATUS[HTTP_STATUS_GROUP.CLIENT_ERROR].UNAUTHORIZED
        ],
    });
    super(
      message || 'Unauthorized',
      {
        layer: meta?.layer || 'HttpClient',
        functionName: meta?.functionName || 'UnauthorizedError',
        response: mockResponse,
      },
    );
  }
}
