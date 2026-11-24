import "reflect-metadata";
import { container } from "tsyringe";
import { ObjectHelper } from "../functions/objectHelper";
import { ComponentState as FWComponentState } from "@core";
import { LanguageService } from "../services/languageService";
import { AlertService } from "../services/alertService";
import { AlertType } from "../constants/alertType";
import { LoadingService } from "../services/loadingService";
import { BaseInfoModel, BaseModel } from "./baseModel";

/**
 * Abstract base state for every view.
 * Holds services, model and lifecycle logic independent from the UI.
 */
export abstract class ComponentState extends FWComponentState {
  public languageService: LanguageService = container.resolve(LanguageService);
  public loadingService = container.resolve(LoadingService);
  public alertService: AlertService = container.resolve(AlertService);
  public alertType = new AlertType();
  public abstract model: BaseModel;
  public abstract modelPropName: string;

  /**
   * Initialize the view state.
   */
  // Async init intentionally extends the core void contract.
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  public abstract init(): Promise<void>;

  /**
   * Constructor.
   */
  public constructor() {
    super();
  }

  /**
   * Deep copy the current state to keep updates immutable.
   * @returns A copied state instance.
   */
  public copy<TObject>(): TObject {
    return ObjectHelper.deepCopy(this) as unknown as TObject;
  }

  /**
   * Handle a form input change and write it back to the model.
   * @param target The changed input element.
   */
  public handleFormInputChanged(
    target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  ): void {
    const me = this;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement
    ) {
      const prop = target.name.replace(me.modelPropName + ".", "");
      const value = target.value;
      me.model.errors = [];
      me.model[prop] = value;
    }
  }
}

/**
 * Abstract base state for create/update information views.
 */
export abstract class InformationComponentState<
  TDetail,
  TModel extends BaseInfoModel<TDetail>,
> extends ComponentState {
  public id = "";

  /**
   * Whether the view is editing an existing record.
   * @returns True when editing an existing record.
   */
  public get isEdit(): boolean {
    return this.id !== "";
  }

  public abstract model: TModel;
  public abstract modelPropName: string;

  /**
   * Build the request payload from the model.
   * @returns The request object.
   */
  public abstract createRequest<T>(): T;

  /**
   * Persist the model data.
   */
  public abstract saveData(): void;
}