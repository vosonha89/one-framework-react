import { describe, expect, it } from "vitest";
import { UiKitState } from "../UiKit.state";

describe("UiKitState", () => {
  it("copy returns a new state instance of the same class", () => {
    const state = new UiKitState();
    const copy = state.copy<UiKitState>();
    expect(copy).not.toBe(state);
    expect(copy).toBeInstanceOf(UiKitState);
  });

  it("handleFormInputChanged writes the value into the model", () => {
    const state = new UiKitState();
    const target = document.createElement("input");
    target.name = "model.email";
    target.value = "user@example.com";
    state.handleFormInputChanged(target);
    expect(state.model.email).toBe("user@example.com");
  });

  it("increment and toggle update the state values", () => {
    const state = new UiKitState();
    state.increment();
    state.toggle();
    expect(state.count).toBe(1);
    expect(state.enabled).toBe(true);
  });

  it("validateEmail reports the model validity", () => {
    const state = new UiKitState();
    expect(state.validateEmail()).toBe(false);
    state.model.email = "user@example.com";
    expect(state.validateEmail()).toBe(true);
  });
});
