import React from "react";
import LanguageHook from "../../hooks/languageHook";

/**
 * Placeholder shown while a view is still initializing.
 * @returns The not ready loading element.
 */
function NotReady(): React.ReactElement {
  const language = LanguageHook();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-3"
      role="status"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
        aria-hidden="true"
      />
      <span className="text-sm text-gray-500">{language.label.loading}</span>
    </div>
  );
}

export default NotReady;