import { ComponentState } from "../../common/types/componentState";
import { UiKitModel } from "./UiKit.model";

/**
 * State for the UiKit showcase: holds the interactive demo values.
 */
export class UiKitState extends ComponentState {
  public model = new UiKitModel();
  public modelPropName = "model";
  public count = 0;
  public enabled = false;

  /**
   * Initialize the view state.
   */
  public async init(): Promise<void> {
    this.isReady = true;
  }

  /**
   * Increment the demo counter.
   */
  public increment(): void {
    const me = this;
    me.count += 1;
  }

  /**
   * Toggle the demo switch.
   */
  public toggle(): void {
    const me = this;
    me.enabled = !me.enabled;
  }

  /**
   * Validate the demo email and surface model errors.
   * @returns True when the email is valid.
   */
  public validateEmail(): boolean {
    const me = this;
    return me.model.isValid();
  }
}