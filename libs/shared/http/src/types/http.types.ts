import {
  HTTP_METHODS,
  HTTP_STATUS,
  HTTP_STATUS_GROUP,
} from '../constants/http.constants';

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];
export type HttpStatusType =
  (typeof HTTP_STATUS_GROUP)[keyof typeof HTTP_STATUS_GROUP];
export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
