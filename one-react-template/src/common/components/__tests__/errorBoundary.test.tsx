import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { container } from "tsyringe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageService } from "../../services/languageService";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

describe("ErrorBoundary", () => {
  beforeEach(async () => {
    await container.resolve(LanguageService).initLanguage();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <p>child content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("renders the localized fallback when a child throws", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const Broken = (): React.ReactElement => {
      throw new Error("boom");
    };
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Đã xảy ra lỗi. Vui lòng tải lại trang.")).toBeInTheDocument();
    consoleError.mockRestore();
    consoleLog.mockRestore();
  });

  it("offers a reload action in the fallback", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const Broken = (): React.ReactElement => {
      throw new Error("boom");
    };
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("button", { name: "Tải lại trang" })).toBeInTheDocument();
    consoleError.mockRestore();
    consoleLog.mockRestore();
  });
});
