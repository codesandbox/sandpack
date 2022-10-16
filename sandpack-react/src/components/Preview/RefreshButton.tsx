import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackNavigation } from "../../hooks/useSandpackNavigation";
import { THEME_PREFIX } from "../../styles";
import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../styles/shared";
import { classNames } from "../../utils/classNames";
import { RefreshIcon } from "../icons";

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
        roundedButtonClassName
      )}
      onClick={refresh}
      title="Refresh Sandpack"
      type="button"
    >
      <RefreshIcon />
    </button>
  );
};
