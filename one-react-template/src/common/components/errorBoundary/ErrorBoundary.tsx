import React from "react";
import "reflect-metadata";
import { container } from "tsyringe";
import { LanguageService } from "../../services/languageService";
import { LogggingService } from "../../services/loggingService";

/**
 * Props accepted by the error boundary.
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * State tracked by the error boundary.
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Root error boundary rendering a localized fallback when a child throws.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };
  private readonly loggingService = container.resolve(LogggingService);

  /**
   * Derive the fallback state from a caught child error.
   * @returns The boundary state marking an error as caught.
   */
  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * Report a caught error through the logging service.
   * @param error The caught child error.
   * @returns Nothing.
   */
  public componentDidCatch(error: unknown): void {
    const me = this;
    me.loggingService.logError(error);
  }

  /**
   * Render children, or the localized fallback after an error.
   * @returns The rendered boundary content.
   */
  public render(): React.ReactElement {
    const me = this;
    const language = container.resolve(LanguageService);
    if (me.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {language.text.errorMessage.unexpectedError}
          </h1>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={() => {
              window.location.reload();
            }}
          >
            {language.text.label.reload}
          </button>
        </div>
      );
    }
    return <>{me.props.children}</>;
  }
}

export default ErrorBoundary;
