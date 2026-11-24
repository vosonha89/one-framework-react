import "reflect-metadata";
import { container } from "tsyringe";
import { useEffect, useState } from "react";
import { GlobalEventValue } from "../constants/eventValue";
import { LanguageService } from "../services/languageService";
import { LanguageText } from "../types/languageText";

/**
 * Hook providing the active language text and reacting to language changes.
 * @returns The current language text.
 */
function LanguageHook(): LanguageText {
  const languageService = container.resolve(LanguageService);
  const [text, setText] = useState<LanguageText>(languageService.text);

  useEffect(() => {
    /**
     * Apply a language change event.
     * @param e Custom event carrying the language code.
     */
    function onLanguageChanged(e: CustomEvent<string>): void {
      const value = e.detail;
      languageService.setLanguage(value);
      setText(languageService.text);
    }
    const handler = (e: Event): void => {
      onLanguageChanged(e as CustomEvent<string>);
    };
    window.addEventListener(GlobalEventValue.languageChanged, handler, false);

    return () => {
      window.removeEventListener(
        GlobalEventValue.languageChanged,
        handler,
        false,
      );
    };
  }, [languageService]);
  return text;
}

export default LanguageHook;