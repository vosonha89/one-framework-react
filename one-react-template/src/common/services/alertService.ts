import "reflect-metadata";
import { container, singleton } from "tsyringe";
import { LanguageService } from "./languageService";
import { AlertType } from "../constants/alertType";

/**
 * Renders transient alert toasts into the alert container.
 */
@singleton()
export class AlertService {
  private readonly language: LanguageService =
    container.resolve(LanguageService);
  private readonly alertTypes: AlertType = new AlertType();

  /**
   * Add an alert box to the alert container.
   * @param alertType Alert severity type.
   * @param message Message to display.
   * @param timeout Auto dismiss delay in milliseconds.
   */
  public addAlert(alertType: string, message: string, timeout = 2000): void {
    const me = this;
    let alertTypeValue = "";
    let className = "alert-item";
    switch (alertType) {
      case me.alertTypes.error.toString():
        alertTypeValue = me.language.text.label.error;
        className = "bg-danger";
        break;
      case me.alertTypes.warning.toString():
        alertTypeValue = me.language.text.label.warning;
        className = "bg-warning";
        break;
      case me.alertTypes.success.toString():
        alertTypeValue = me.language.text.label.success;
        className = "bg-success";
        break;
      case me.alertTypes.info.toString():
        alertTypeValue = me.language.text.label.information;
        className = "bg-info";
        break;
    }
    const mainContainer = document.getElementById("alertContainer");
    const alertBox = document.createElement("div");
    alertBox.setAttribute("role", "alert");
    alertBox.setAttribute("aria-live", "assertive");
    alertBox.setAttribute("aria-atomic", "true");
    alertBox.className = className;

    // Build the toast with safe DOM APIs; dynamic text uses textContent.
    const header = document.createElement("div");
    header.className = "toast-header";
    const title = document.createElement("div");
    title.className = "me-auto fw-semibold";
    title.textContent = alertTypeValue;
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "btn-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.addEventListener("click", () => {
      alertBox.remove();
    });
    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement("div");
    body.className = "toast-body";
    body.textContent = message;

    alertBox.appendChild(header);
    alertBox.appendChild(body);
    mainContainer?.appendChild(alertBox);
    setTimeout(() => {
      alertBox.remove();
    }, timeout);
  }
}