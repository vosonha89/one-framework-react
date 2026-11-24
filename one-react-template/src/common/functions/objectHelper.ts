import "reflect-metadata";
import { container } from "tsyringe";
import { ObjectHelper as FWObjectHelper } from "@core";

/**
 * Object helper utilities with an immutable, prototype-preserving deep copy.
 */
export class ObjectHelper extends FWObjectHelper {
  /**
   * Deep copy a value while preserving class prototypes and reusing DI services.
   * Unlike the framework default, the source is not chained as the prototype of
   * the copy and object fields (model, lists) are cloned instead of shared.
   * @param value Source value to copy.
   * @returns An independent copy sharing only the class prototype and services.
   */
  public static deepCopy<T extends object>(value: T): T {
    return ObjectHelper.cloneValue(value) as T;
  }

  /**
   * Recursively clone a value, preserving prototypes and reusing registered services.
   * @param value Value to clone.
   * @returns The cloned value.
   */
  private static cloneValue(value: unknown): unknown {
    if (value === null || typeof value !== "object") {
      return value;
    }
    if (value instanceof Date) {
      return new Date(value.getTime());
    }
    if (Array.isArray(value)) {
      return value.map((item) => ObjectHelper.cloneValue(item));
    }
    const ctor = (value as { constructor?: unknown }).constructor;
    if (
      typeof ctor === "function" &&
      container.isRegistered(ctor as new (...args: unknown[]) => unknown)
    ) {
      // Reuse DI service instances (singletons) instead of detaching copies.
      return value;
    }
    const proto = Object.getPrototypeOf(value) as object | null;
    const copy = Object.create(proto) as Record<string, unknown>;
    const source = value as Record<string, unknown>;
    for (const key of Object.keys(source)) {
      copy[key] = ObjectHelper.cloneValue(source[key]);
    }
    return copy;
  }
}