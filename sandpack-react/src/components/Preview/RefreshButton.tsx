import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackNavigation } from "../../hooks/useSandpackNavigation";
import { RefreshIcon } from "../../icons";

/**
 * @category Components
 */
export const RefreshButton: React.FC<{
  clientId?: string;
}> = ({ clientId }) => {
  const { refresh } = useSandpackNavigation(clientId);
  const c = useClasser("sp");

  return (
    <button
      className={c("button", "icon-standalone")}
      onClick={refresh}
      title="Refresh Sandpack"
      type="button"
    >
      <RefreshIcon />
    </button>
  );
};
