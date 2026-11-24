import { injectable } from "tsyringe";
import {
  AppError,
  BaseService,
  SystemError,
} from "../common/services/baseService";
import { AppEnvironment } from "../common/constants/appEnvironment";
import { SampleRequest } from "./requestObject/sample.Request";
import { SampleListResponse } from "./responseObject/sample.Response";
import { SampleObject } from "../types/sampleObject";

/**
 * Business service for the sample feature.
 */
@injectable()
export class SampleService extends BaseService {
  public apiUrl: { [key: string]: string } = {
    listUrl: AppEnvironment.VITE_APP_API_URL + "/products",
  };

  /**
   * Get sample items from the API.
   * @param request Query request.
   * @returns The mapped items or a system error.
   */
  public async getItems(
    request: SampleRequest,
  ): Promise<SampleObject[] | SystemError> {
    const me = this;
    try {
      const headers = me.getDefaultHeader();
      const url = `${me.apiUrl.listUrl}?limit=${request.limit}&skip=${request.skip}`;
      const requestOptions: RequestInit = {
        method: "GET",
        headers,
        redirect: "follow",
      };
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const result = (await response.json()) as SampleListResponse;
        return result.products.map((item) => {
          const object = new SampleObject();
          object.map(item);
          return object;
        });
      } else {
        throw new AppError(
          me.languageService.text.errorMessage.internalServerError,
        );
      }
    } catch (error) {
      return me.handleError(error as Error);
    }
  }
}