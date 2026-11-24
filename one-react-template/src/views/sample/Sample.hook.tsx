import { useEffect, useState } from "react";
import { SampleState } from "./Sample.state";
import InputFormHook, {
  InputFormHookResult,
} from "../../common/hooks/formHook";

/**
 * Result returned by the sample hook.
 */
export interface SampleHookResult {
  componentState: SampleState;
  search(): Promise<void>;
  handleFormInputChanged: InputFormHookResult["handleFormInputChanged"];
}

/**
 * Hook orchestrating the sample view: state, lifecycle and actions.
 * @returns The sample view state and actions.
 */
function SampleHook(): SampleHookResult {
  const [componentState, setcomponentState] = useState<SampleState>(
    new SampleState(),
  );
  const inputFormHook = InputFormHook(componentState, setcomponentState);

  /**
   * Run the search action and push the new state.
   */
  async function search(): Promise<void> {
    const pageState: SampleState = componentState.copy<SampleState>();
    await pageState.search();
    setcomponentState(pageState);
  }

  useEffect(() => {
    let ignore = false;
    /**
     * Load the page on first render, guarded against unmount/double-invoke.
     */
    async function loadPage(): Promise<void> {
      const pageState: SampleState = componentState.copy<SampleState>();
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
    search,
    handleFormInputChanged: inputFormHook.handleFormInputChanged,
  };
}

export default SampleHook;