import "reflect-metadata";
import { container } from "tsyringe";
import {
  AbstractModel,
  ErrorModel as FWErrorModel,
} from "@core";
import { LanguageService } from "../services/languageService";
import { BaseList } from "./baseType";
import { ConstantValue } from "../constants/constantValue";
import { ObjectHelper } from "../functions/objectHelper";

/**
 * Model for showing a validation error on a property.
 */
export interface ErrorModel extends FWErrorModel {
  property: string;
  error: string;
}

/**
 * Abstract base for all view models.
 */
export abstract class BaseModel extends AbstractModel<ErrorModel> {
  public readonly languageService = container.resolve(LanguageService);

  [key: string]: unknown;
  public errors: ErrorModel[] = [];

  /**
   * Check whether a property has a validation error.
   * @param prop Property name to check.
   * @returns True when the property has an error.
   */
  public checkError(prop: string): boolean {
    const me = this;
    if (me.errors.findIndex((a) => a.property === prop) != -1) {
      return true;
    }
    return false;
  }

  /**
   * Build the error markup for a property.
   * @param prop Property name to read errors for.
   * @returns HTML label containing the error messages.
   */
  public getError(prop: string): string {
    const me = this;
    let errorMessage = "";
    if (me.errors.length > 0) {
      for (const error of me.errors) {
        if (error.property === prop) {
          errorMessage +=
            '<span class="label-text text-danger">' +
            BaseModel.escapeHtml(error.error) +
            "</span>";
        }
      }
    }
    return (
      '<label class="label flex-col items-start">' + errorMessage + "</label>"
    );
  }

  /**
   * Escape HTML special characters to prevent injection.
   * @param text Raw text to escape.
   * @returns Text safe for HTML interpolation.
   */
  private static escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}

/**
 * Abstract base for models used on create/update screens.
 */
export abstract class BaseInfoModel<T> extends BaseModel {
  public id = "";

  /**
   * Validate the model.
   * @returns True when the model is valid.
   */
  public abstract isValid(): boolean;

  /**
   * Apply existing data for editing.
   * @param objectEdit Source object to map from.
   */
  public abstract applyData(objectEdit: T): void;
}

/**
 * Abstract base for paginated listing models.
 */
export abstract class BaseModelList<T> extends BaseModel {
  public dataList: BaseList<T>;
  public maxPageList: number;
  public pagingList: number[];

  /**
   * Constructor.
   * @param maxPageList Maximum number of paging buttons.
   */
  public constructor(maxPageList = 5) {
    super();
    this.maxPageList = maxPageList;
    this.pagingList = [];
    for (let i = 1; i <= maxPageList; i++) {
      this.pagingList.push(i);
    }
    this.dataList = {
      data: [],
      pageIndex: ConstantValue.pageIndex,
      pageSize: ConstantValue.pageSize,
      totalPage: 0,
      totalRecord: 0,
    };
  }

  /**
   * Get the current page from the URL.
   * @returns Current page index.
   */
  public getCurrentPage(): number {
    const pageParam = ObjectHelper.getURLParam("page");
    if (pageParam != null) {
      const page = parseInt(pageParam, 10);
      return Number.isFinite(page) && page > 0 ? page : 0;
    }
    return 0;
  }

  /**
   * Update paging after loading data.
   * @param pageIndex Target page index.
   * @param isNext Whether navigating forward.
   */
  public updatePaging(pageIndex: number, isNext = false): void {
    const me = this;
    if (isNext) {
      let lastPage = me.pagingList[me.maxPageList - 1];
      if (pageIndex > lastPage && lastPage < me.dataList.totalPage) {
        if (pageIndex > lastPage + me.maxPageList) {
          lastPage = pageIndex;
          if (lastPage >= me.dataList.totalPage - 1) {
            lastPage = me.dataList.totalPage - me.maxPageList;
          }
        } else {
          lastPage = pageIndex - me.maxPageList;
        }
        lastPage = Math.max(
          0,
          Math.min(lastPage, me.dataList.totalPage - me.maxPageList),
        );
        me.addValuesToPageList(lastPage, true);
      }
    } else {
      const lastPage = me.pagingList[0];
      if (pageIndex < lastPage - 1 && pageIndex > 0) {
        me.addValuesToPageList(lastPage, false);
      }
    }

    if (me.dataList.pageIndex == ConstantValue.pageIndex) {
      if (me.maxPageList >= me.dataList.totalPage) {
        me.maxPageList = me.dataList.totalPage;
      }
      me.addValuesToPageList(ConstantValue.pageIndex - 1, true);
    }
    ObjectHelper.setURLParam("page", pageIndex.toString());
  }

  /**
   * Rebuild the paging button list.
   * @param lastPage Anchor page index.
   * @param isNext Whether navigating forward.
   */
  public addValuesToPageList(lastPage: number, isNext: boolean): void {
    const me = this;
    me.pagingList = [];
    if (isNext) {
      for (let i = 1; i <= me.maxPageList; i++) {
        me.pagingList.push(lastPage + i);
      }
    } else {
      for (let i = me.maxPageList; i >= 1; i--) {
        me.pagingList.push(lastPage - i);
      }
    }
  }
}