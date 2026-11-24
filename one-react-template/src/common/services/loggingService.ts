import "reflect-metadata";
import { singleton } from "tsyringe";
import { AbstractLogggingService, ObjectHelper } from "@core";
import { LanguageText } from "../types/languageText";

/**
 * Server error shape.
 */
export interface ServerError {
  code: string;
  title: string;
  message: string;
  type: string;
}

/**
 * Logging service implementation.
 */
@singleton()
export class LogggingService extends AbstractLogggingService {
  /**
   * Log an error to the console.
   * @param ex The error to log.
   */
  public logError(ex: unknown): void {
    console.log(ex);
  }

  /**
   * Resolve a localized error message by code.
   * @param language Language text to read from.
   * @param code Error code key.
   * @param defaultValue Fallback message.
   * @returns The resolved or fallback message.
   */
  public getError(
    language: LanguageText,
    code: string,
    defaultValue: string,
  ): string {
    try {
      const value = ObjectHelper.getValue(language, code) as string;
      if (value) {
        return value;
      }
      return defaultValue;
    } catch (ex) {
      console.log(ex);
      return defaultValue;
    }
  }
}