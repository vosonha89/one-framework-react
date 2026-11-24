import { AbstractObjectType } from "@core";
import { SampleItemResponse } from "../services/responseObject/sample.Response";

/**
 * Domain object for a sample item.
 */
export class SampleObject extends AbstractObjectType<SampleItemResponse> {
  public id!: number;
  public title!: string;
  public price!: number;

  /**
   * Constructor.
   */
  public constructor() {
    super();
  }

  /**
   * Map an API response into the domain object.
   * @param object Raw API item.
   */
  public override map(object: SampleItemResponse): void {
    super.map(object);
  }
}