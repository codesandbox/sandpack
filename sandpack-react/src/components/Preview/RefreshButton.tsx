import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackNavigation } from "../../hooks/useSandpackNavigation";
import { RefreshIcon } from "../../icons";
import { THEME_PREFIX } from "../../styles";
import {
  buttonClassName,
  iconStandaloneClassName,
  actionButtonClassName,
} from "../../styles/shared";
import { classNames } from "../../utils/classNames";

interface RefreshButtonProps {
  clientId?: string;
}

/**
 * @category Components
 */
export const RefreshButton = ({
  clientId,
}: RefreshButtonProps): JSX.Element => {
  const { refresh } = useSandpackNavigation(clientId);
  const c = useClasser(THEME_PREFIX);

  return (
    <button
      className={classNames(
        c("button", "icon-standalone"),
        buttonClassName,
        iconStandaloneClassName,
        actionButtonClassName
      )}
      onClick={refresh}
      title="Refresh Sandpack"
      type="button"
    >
      <RefreshIcon />
    </button>
  );
};
