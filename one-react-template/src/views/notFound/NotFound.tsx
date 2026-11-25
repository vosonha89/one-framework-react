import React from "react";
import { Link } from "react-router-dom";
import LanguageHook from "../../common/hooks/languageHook";

/**
 * View shown for unmatched routes. UI only.
 * @returns The not found view element.
 */
function NotFound(): React.ReactElement {
  const language = LanguageHook();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-6xl font-bold text-gray-300">404</p>
      <h1 className="text-xl font-semibold text-gray-900">
        {language.label.pageNotFound}
      </h1>
      <Link
        to="/"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        {language.label.backHome}
      </Link>
    </div>
  );
}

export default NotFound;
