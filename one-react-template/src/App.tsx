import React, { useEffect } from "react";
import "./App.scss";
import GlobalHook from "./common/hooks/globalHook";
import ErrorBoundary from "./common/components/errorBoundary/ErrorBoundary";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";

// Create the router once at module scope so renders do not reset it.
const router = createBrowserRouter(AppRouter);

/**
 * Root application component wiring the router and global metadata.
 * @returns The root application element.
 */
function App(): React.ReactElement {
  const global = GlobalHook();

  useEffect(() => {
    document.title = global.appName;
  }, [global.appName]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;