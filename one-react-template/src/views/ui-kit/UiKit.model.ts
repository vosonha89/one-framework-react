import validator from "validator";
import { BaseModel } from "../../common/types/baseModel";

/**
 * Model for the UiKit demo form (email validation showcase).
 */
export class UiKitModel extends BaseModel {
  public email: string = "";

  /**
   * Validate the demo email field.
   * @returns True when the model is valid.
   */
  public isValid(): boolean {
    const me = this;
    me.errors = [];
    if (!validator.isEmail(me.email)) {
      me.errors.push({
        property: "email",
        error: "Please enter a valid email address.",
      });
    }
    return me.errors.length === 0;
  }
}