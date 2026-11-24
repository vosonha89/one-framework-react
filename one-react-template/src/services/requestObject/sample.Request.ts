/**
 * Request for querying sample items.
 */
export class SampleRequest {
  public limit: number;
  public skip: number;

  /**
   * Constructor.
   * @param limit Maximum number of items to return.
   * @param skip Number of items to skip.
   */
  public constructor(limit = 10, skip = 0) {
    this.limit = limit;
    this.skip = skip;
  }
}