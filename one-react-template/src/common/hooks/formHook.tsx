import type { Dispatch, SetStateAction } from "react";
import { ComponentState } from "../types/componentState";

/**
 * Form input element types supported by the form hook.
 */
export type FormInputTarget =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

/**
 * Result returned by the input form hook.
 */
export interface InputFormHookResult {
  handleFormInputChanged: (target: FormInputTarget) => void;
}

/**
 * Input form hook bridging DOM input changes to the component state.
 * @param componentState Current component state.
 * @param setcomponentState State setter.
 * @returns Form input change handler.
 */
function InputFormHook<T extends ComponentState>(
  componentState: T,
  setcomponentState: Dispatch<SetStateAction<T>>,
): InputFormHookResult {
  /**
   * Copy state, apply the input change and push the new state.
   * @param target The changed input element.
   */
  function handleFormInputChanged(target: FormInputTarget): void {
    const pageState: T = componentState.copy<T>();
    pageState.handleFormInputChanged(target);
    setcomponentState(pageState);
  }
  return {
    handleFormInputChanged,
  };
}

export default InputFormHook;