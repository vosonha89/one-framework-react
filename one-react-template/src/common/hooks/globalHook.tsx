import { AppEnvironment } from "../constants/appEnvironment";

/**
 * Result returned by the global hook.
 */
export interface GlobalHookResult {
  addScript(
    id: string,
    link: string,
    checkerName: string,
    maxCheck: number,
  ): Promise<boolean>;
  appVersion: string;
  appName: string;
  appEnv: string;
}

/**
 * Global hook exposing app metadata and shared utilities for all screens.
 * @returns Global utilities and app metadata.
 */
function GlobalHook(): GlobalHookResult {
  const appVersion = AppEnvironment.VITE_APP_VERSION;
  const appName = AppEnvironment.VITE_APP_TITLE;
  const appEnv = AppEnvironment.VITE_APP_ENV;

  /**
   * Inject an external script and wait until its global checker is available.
   * @param id Unique script element id.
   * @param link Script source URL.
   * @param checkerName Global variable name to poll for.
   * @param maxCheck Maximum number of polling attempts.
   * @returns True when the script global is available.
   */
  function addScript(
    id: string,
    link: string,
    checkerName: string,
    maxCheck: number,
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const scripts = Array.from(document.scripts);
        if (scripts.findIndex((a) => a.id == id) == -1) {
          const script = document.createElement("script");
          script.id = id;
          script.src = link;
          script.async = true;
          document.body.appendChild(script);
          let checkTime = 0;
          const intervalChecker = setInterval(() => {
            checkTime++;
            if (checkTime < maxCheck) {
              const checker = (window as unknown as Record<string, unknown>)[
                checkerName
              ];
              if (checker) {
                clearInterval(intervalChecker);
                resolve(true);
              }
            } else {
              clearInterval(intervalChecker);
              resolve(false);
            }
          }, 200);
        } else {
          resolve(true);
        }
      } catch (ex) {
        reject(ex instanceof Error ? ex : new Error(String(ex)));
      }
    });
  }

  return { addScript, appVersion, appName, appEnv };
}

export default GlobalHook;