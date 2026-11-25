import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { container } from "tsyringe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LanguageService } from "../../../common/services/languageService";
import NotFound from "../NotFound";

describe("NotFound", () => {
  beforeEach(async () => {
    await container.resolve(LanguageService).initLanguage();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows the localized 404 heading", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByText("Không tìm thấy trang")).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("links back to the home route", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Về trang chủ" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
