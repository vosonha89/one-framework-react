import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LoadingService } from "../loadingService";

describe("LoadingService", () => {
  let loadingEl: HTMLDivElement | null = null;

  beforeEach(() => {
    loadingEl = document.createElement("div");
    loadingEl.id = "loading";
    document.body.appendChild(loadingEl);
  });

  afterEach(() => {
    loadingEl?.remove();
  });

  it("show displays the loading overlay", () => {
    const service = new LoadingService();
    expect(service.show()).toBe(true);
    expect(document.getElementById("loading")?.style.display).toBe("flex");
  });

  it("hide hides the loading overlay", () => {
    const service = new LoadingService();
    service.show();
    expect(service.hide()).toBe(true);
    expect(document.getElementById("loading")?.style.display).toBe("none");
  });

  it("returns false when the overlay element is missing", () => {
    loadingEl?.remove();
    const service = new LoadingService();
    expect(service.show()).toBe(false);
    expect(service.hide()).toBe(false);
  });
});
