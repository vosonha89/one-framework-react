import React from "react";

/**
 * Fallback shown while a view is still initializing.
 * @returns The not ready placeholder element.
 */
function NotReady(): React.ReactElement {
  return <div>Not ready</div>;
}

export default NotReady;