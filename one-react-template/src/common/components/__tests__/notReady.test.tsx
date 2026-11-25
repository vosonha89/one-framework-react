import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { container } from "tsyringe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LanguageService } from "../../services/languageService";
import NotReady from "../notReady/NotReady";

describe("NotReady", () => {
  beforeEach(async () => {
    await container.resolve(LanguageService).initLanguage();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows the localized loading label", () => {
    render(<NotReady />);
    expect(screen.getByText("Đang tải…")).toBeInTheDocument();
  });

  it("marks the placeholder as a live status region", () => {
    render(<NotReady />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
