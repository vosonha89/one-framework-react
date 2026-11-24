/**
 * Raw sample item returned by the API.
 */
export interface SampleItemResponse {
  id: number;
  title: string;
  price: number;
}

/**
 * Raw sample list response returned by the API.
 */
export interface SampleListResponse {
  products: SampleItemResponse[];
  total: number;
  skip: number;
  limit: number;
}