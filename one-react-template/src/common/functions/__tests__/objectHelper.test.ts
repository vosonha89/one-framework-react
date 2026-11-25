import { describe, expect, it } from "vitest";
import { ObjectHelper } from "../objectHelper";

/**
 * Sample nested value holder.
 */
class NestedValue {
  public value = "inner";
}

/**
 * Sample holder with primitive, nested and date fields.
 */
class SampleHolder {
  public name = "original";
  public nested = new NestedValue();
  public created = new Date(2026, 0, 1);
}

describe("ObjectHelper", () => {
  it("deepCopy copies primitive fields independently", () => {
    const source = new SampleHolder();
    const copy = ObjectHelper.deepCopy(source);
    copy.name = "changed";
    expect(copy.name).toBe("changed");
    expect(source.name).toBe("original");
  });

  it("deepCopy keeps the class prototype", () => {
    const source = new SampleHolder();
    const copy = ObjectHelper.deepCopy(source);
    expect(copy).toBeInstanceOf(SampleHolder);
    expect(copy.nested).toBeInstanceOf(NestedValue);
  });

  it("deepCopy clones nested objects instead of sharing them", () => {
    const source = new SampleHolder();
    const copy = ObjectHelper.deepCopy(source);
    copy.nested.value = "changed";
    expect(source.nested.value).toBe("inner");
  });

  it("deepCopy clones date fields", () => {
    const source = new SampleHolder();
    const copy = ObjectHelper.deepCopy(source);
    expect(copy.created.getTime()).toBe(source.created.getTime());
    expect(copy.created).not.toBe(source.created);
  });
});
