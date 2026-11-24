import "reflect-metadata";
import { container, singleton } from "tsyringe";
import en from "../../assets/language/en.json";
import vi from "../../assets/language/vi.json";
import { LanguageCode, StorageKey } from "@core";
import { StorageService } from "./storageService";
import { LanguageText } from "../types/languageText";

/**
 * Loads and switches the active locale text.
 */
@singleton()
export class LanguageService {
  public readonly storeService = container.resolve(StorageService);
  public text!: LanguageText;
  public readonly defaultLanguage = LanguageCode.VI;

  /**
   * Initialize the language from storage or the default locale.
   */
  public async initLanguage(): Promise<void> {
    const me = this;
    let currentLanguage = await me.storeService.getObject<string>(
      StorageKey.language,
    );
    if (!currentLanguage) {
      currentLanguage = me.defaultLanguage;
    }
    me.getLanguageText(currentLanguage);
  }

  /**
   * Persist and apply a new language.
   * @param value Language code to switch to.
   */
  public setLanguage(value: string): void {
    const me = this;
    void me.storeService.saveObject<string>(StorageKey.language, value);
    me.getLanguageText(value);
  }

  /**
   * Load the locale text for a language code.
   * @param value Language code to load.
   */
  public getLanguageText(value: string): void {
    const me = this;
    if (value === String(LanguageCode.EN)) {
      me.text = en;
    } else {
      me.text = vi;
    }
  }
}