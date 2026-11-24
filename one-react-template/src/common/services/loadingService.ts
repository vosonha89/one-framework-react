import "reflect-metadata";
import { singleton } from "tsyringe";

/**
 * Controls the global loading overlay.
 */
@singleton()
export class LoadingService {
  /**
   * Show the loading overlay.
   * @returns True when the overlay element exists.
   */
  public show(): boolean {
    const loadingEl = document.getElementById("loading");
    if (loadingEl) {
      loadingEl.style.display = "flex";
      return true;
    } else {
      return false;
    }
  }

  /**
   * Hide the loading overlay.
   * @returns True when the overlay element exists.
   */
  public hide(): boolean {
    const loadingEl = document.getElementById("loading");
    if (loadingEl) {
      loadingEl.style.display = "none";
      return true;
    } else {
      return false;
    }
  }
}