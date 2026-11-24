import "reflect-metadata";
import { container } from "tsyringe";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { LanguageService } from "./common/services/languageService.ts";

// Register and initialize the language service before rendering.
const languageService = container.resolve(LanguageService);
await languageService.initLanguage();

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}