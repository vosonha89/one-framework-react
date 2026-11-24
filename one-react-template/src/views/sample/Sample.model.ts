import validator from "validator";
import { BaseModel } from "../../common/types/baseModel";

/**
 * Model for the sample view search form.
 */
export class SampleModel extends BaseModel {
  public keyword: string = "";

  /**
   * Validate the search keyword.
   * @returns True when the model is valid.
   */
  public isValid(): boolean {
    const me = this;
    me.errors = [];
    if (validator.isEmpty(me.keyword)) {
      me.errors.push({
        property: "keyword",
        error: me.languageService.text.errorMessage.requiredField.replace(
          "{field}",
          me.languageService.text.sample.keyword,
        ),
      });
    }
    return me.errors.length === 0;
  }
}