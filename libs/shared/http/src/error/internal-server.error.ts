import {
  HTTP_STATUS,
  HTTP_STATUS_GROUP,
  HTTP_STATUS_TEXT,
} from '../constants/http.constants';
import { HttpClientError, HttpClientErrorMetadata } from './http-client.error';

export class InternalServerError extends HttpClientError {
  constructor(message?: string, meta?: HttpClientErrorMetadata) {
    const mockResponse = new Response(null, {
      status: HTTP_STATUS[HTTP_STATUS_GROUP.SERVER_ERROR].INTERNAL_SERVER_ERROR,
      statusText:
        HTTP_STATUS_TEXT[HTTP_STATUS_GROUP.SERVER_ERROR][
          HTTP_STATUS[HTTP_STATUS_GROUP.SERVER_ERROR].INTERNAL_SERVER_ERROR
        ],
    });
    super(
      message || 'Internal Server Error',
      {
        layer: meta?.layer || 'HttpClient',
        functionName: meta?.functionName || 'InternalServerError',
        response: mockResponse,
      },
    );
  }
}
