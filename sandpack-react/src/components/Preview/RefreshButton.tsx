import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackNavigation } from "../../hooks/useSandpackNavigation";
import { RefreshIcon } from "../../icons";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";

interface RefreshButtonProps {
  clientId?: string;
}

const buttonClassName = css({
  appearance: "none",
  border: "0",
  outline: "none",
  padding: "$space$1 $space$3 $space$1 $space$2",
  borderRadius: "$border$radius",
  display: "flex",
  alignItems: "center",
  color: "$colors$defaultText",
  backgroundColor: "$colors$defaultBackground",
  fontSize: "inherit",
  fontFamily: "inherit",
  transition: "all 0.15s ease-in-out",
});

const iconStandaloneClassName = css({
  padding: "$space$1",
  background: "#f8f9fbcf",
  backdropFilter: "blur(4px)",
  width: "$space$8",
  height: "$space$8",
});

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
        iconStandaloneClassName
      )}
      onClick={refresh}
      title="Refresh Sandpack"
      type="button"
    >
      <RefreshIcon />
    </button>
  );
};
