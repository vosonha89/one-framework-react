import { describe, expect, it } from "vitest";
import { UiKitModel } from "../UiKit.model";

describe("UiKitModel", () => {
  it("rejects an empty email and records the error", () => {
    const model = new UiKitModel();
    expect(model.isValid()).toBe(false);
    expect(model.errors[0]?.property).toBe("email");
    expect(model.checkError("email")).toBe(true);
  });

  it("accepts a valid email", () => {
    const model = new UiKitModel();
    model.email = "user@example.com";
    expect(model.isValid()).toBe(true);
    expect(model.errors.length).toBe(0);
    expect(model.checkError("email")).toBe(false);
  });

  it("clears previous errors on every validation run", () => {
    const model = new UiKitModel();
    model.isValid();
    model.email = "user@example.com";
    model.isValid();
    expect(model.errors.length).toBe(0);
  });
});
