import {
  HTTP_STATUS,
  HTTP_STATUS_GROUP,
  HTTP_STATUS_TEXT,
} from '../constants/http.constants';
import { HttpClientError, HttpClientErrorMetadata } from './http-client.error';

export class NotFoundError extends HttpClientError {
  constructor(message?: string, meta?: HttpClientErrorMetadata) {
    const mockResponse = new Response(null, {
      status: HTTP_STATUS[HTTP_STATUS_GROUP.CLIENT_ERROR].NOT_FOUND,
      statusText:
        HTTP_STATUS_TEXT[HTTP_STATUS_GROUP.CLIENT_ERROR][
          HTTP_STATUS[HTTP_STATUS_GROUP.CLIENT_ERROR].NOT_FOUND
        ],
    });
    super(
      message || 'Not Found',
      {
        layer: meta?.layer || 'HttpClient',
        functionName: meta?.functionName || 'NotFoundError',
        response: mockResponse,
      },
    );
  }
}
