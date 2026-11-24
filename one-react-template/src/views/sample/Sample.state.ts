import { container } from "tsyringe";
import { ComponentState } from "../../common/types/componentState";
import { SampleModel } from "./Sample.model";
import { SampleService } from "../../services/sample.Service";
import { SampleRequest } from "../../services/requestObject/sample.Request";
import { SampleObject } from "../../types/sampleObject";
import { SystemError } from "../../common/services/baseService";
import { ObjectHelper } from "../../common/functions/objectHelper";

/**
 * State for the sample view: holds items and orchestrates loading/search.
 */
export class SampleState extends ComponentState {
  private readonly sampleService = container.resolve(SampleService);
  public model = new SampleModel();
  public modelPropName = "model";
  public items: SampleObject[] = [];

  /**
   * Initialize the view by loading items.
   */
  public async init(): Promise<void> {
    const me = this;
    await me.loadItems();
    me.isReady = true;
  }

  /**
   * Validate the keyword and reload items.
   * @returns True when the search was performed.
   */
  public async search(): Promise<boolean> {
    const me = this;
    if (me.model.isValid()) {
      await me.loadItems();
      return true;
    }
    return false;
  }

  /**
   * Load items from the service and update state.
   */
  private async loadItems(): Promise<void> {
    const me = this;
    me.loadingService.show();
    const response = await me.sampleService.getItems(new SampleRequest());
    me.loadingService.hide();
    if (ObjectHelper.hasApiError(response)) {
      me.alertService.addAlert(
        me.alertType.error.toString(),
        (response as SystemError).message,
      );
    } else {
      me.items = response as SampleObject[];
    }
  }
}