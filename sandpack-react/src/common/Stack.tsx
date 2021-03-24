import { useClasser } from "@code-hike/classer";
import * as React from "react";

export const SandpackStack: React.FC<{ customStyle?: React.CSSProperties }> = ({
  children,
  customStyle,
}) => {
  const c = useClasser("sp");

  return (
    <div className={c("stack")} style={customStyle}>
      {children}
    </div>
  );
};
