import "reflect-metadata";
import { container } from "tsyringe";
import { LogggingService } from "./loggingService";
import { LanguageService } from "./languageService";
import { StorageService } from "./storageService";
import { StatusCode } from "@core";

/**
 * Application error carrying a localized message.
 */
export class AppError extends Error {
  public onApp: boolean = true;
}

/**
 * System error returned to callers instead of throwing.
 */
export class SystemError {
  public code = 0;
  public message = "";
}

/**
 * Abstract base for all business services.
 */
export abstract class BaseService {
  public readonly languageService: LanguageService =
    container.resolve(LanguageService);
  public readonly loggingService: LogggingService =
    container.resolve(LogggingService);
  public readonly storageService: StorageService =
    container.resolve(StorageService);

  public abstract apiUrl: { [key: string]: string };

  /**
   * Build the default request headers.
   * @param accept Accept header value.
   * @param contentType Content-Type header value.
   * @returns Configured headers.
   */
  public getDefaultHeader(
    accept = "application/json",
    contentType = "application/json",
  ): Headers {
    const headers = new Headers();
    if (accept) {
      headers.append("Accept", accept);
    }
    if (contentType) {
      headers.append("Content-Type", contentType);
    }
    return headers;
  }

  /**
   * Convert a thrown error into a system error result.
   * @param error The caught error.
   * @returns A system error with code and localized message.
   */
  public handleError<T extends Error>(error: T): SystemError {
    const me = this;
    me.loggingService.logError(error);
    if (error instanceof AppError) {
      return {
        code: StatusCode.InternalServerError,
        message: error.message,
      };
    }
    return {
      code: StatusCode.InternalServerError,
      message: me.languageService.text.errorMessage.internalServerError,
    };
  }
}