import { useEffect, useState } from "react";
import { UiKitState } from "./UiKit.state";
import InputFormHook, {
  InputFormHookResult,
} from "../../common/hooks/formHook";

/**
 * Result returned by the UiKit hook.
 */
export interface UiKitHookResult {
  componentState: UiKitState;
  increment(): void;
  toggle(): void;
  validateEmail(): boolean;
  handleFormInputChanged: InputFormHookResult["handleFormInputChanged"];
}

/**
 * Hook orchestrating the UiKit view: state, lifecycle and demo actions.
 * @returns The UiKit view state and actions.
 */
function UiKitHook(): UiKitHookResult {
  const [componentState, setcomponentState] = useState<UiKitState>(
    new UiKitState(),
  );
  const inputFormHook = InputFormHook(componentState, setcomponentState);

  /**
   * Increment the counter and push the new state.
   */
  function increment(): void {
    const pageState: UiKitState = componentState.copy<UiKitState>();
    pageState.increment();
    setcomponentState(pageState);
  }

  /**
   * Toggle the switch and push the new state.
   */
  function toggle(): void {
    const pageState: UiKitState = componentState.copy<UiKitState>();
    pageState.toggle();
    setcomponentState(pageState);
  }

  /**
   * Validate the email and push the new state.
   * @returns True when the email is valid.
   */
  function validateEmail(): boolean {
    const pageState: UiKitState = componentState.copy<UiKitState>();
    const valid = pageState.validateEmail();
    setcomponentState(pageState);
    return valid;
  }

  useEffect(() => {
    let ignore = false;
    /**
     * Load the page on first render, guarded against unmount/double-invoke.
     */
    async function loadPage(): Promise<void> {
      const pageState: UiKitState = componentState.copy<UiKitState>();
      await pageState.init();
      if (!ignore) {
        setcomponentState(pageState);
      }
    }
    void loadPage();
    return () => {
      ignore = true;
    };
    // Init runs once; state is copied to avoid stale closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    componentState,
    increment,
    toggle,
    validateEmail,
    handleFormInputChanged: inputFormHook.handleFormInputChanged,
  };
}

export default UiKitHook;