/**
 * Base API response envelope.
 */
export interface BaseResponseData<T> {
  serverDateTime: Date;
  status: number;
  msg: string;
  exception: null;
  data: T;
  successful: boolean;
}

/**
 * Base paginated search response.
 */
export interface BaseSearchResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  elements: T[];
  hasPrevious: boolean;
  hasMore: boolean;
}