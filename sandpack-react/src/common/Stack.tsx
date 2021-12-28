import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { css, THEME_PREFIX } from "../styles";
import { classNames } from "../utils/classNames";

export const stackClassName = css({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

/**
 * @category Components
 */
export const SandpackStack: React.FC<{ customStyle?: React.CSSProperties }> = ({
  children,
  customStyle,
}) => {
  const c = useClasser(THEME_PREFIX);

  return (
    <div className={classNames(c("stack"), stackClassName)} style={customStyle}>
      {children}
    </div>
  );
};
