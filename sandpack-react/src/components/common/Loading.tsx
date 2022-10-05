import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { css, THEME_PREFIX, keyframes } from "../../styles";
import { buttonClassName } from "../../styles/shared";
import { classNames } from "../../utils/classNames";

import { OpenInCodeSandboxButton } from "./OpenInCodeSandboxButton";

const cubeClassName = css({
  transform: "translate(-4px, 9px) scale(0.13, 0.13)",
  "*": { position: "absolute", width: "96px", height: "96px" },
});

const wrapperClassName = css({
  position: "absolute",
  right: "$space$2",
  bottom: "$space$2",
  zIndex: "$top",
  width: "32px",
  height: "32px",
  borderRadius: "$border$radius",

  [`.${cubeClassName}`]: { display: "flex" },
  [`.${buttonClassName}`]: { display: "none" },
  [`&:hover .${buttonClassName}`]: { display: "flex" },
  [`&:hover .${cubeClassName}`]: { display: "none" },
});

const cubeRotate = keyframes({
  "0%": {
    transform: "rotateX(-25.5deg) rotateY(45deg)",
  },

  "100%": {
    transform: "rotateX(-25.5deg) rotateY(405deg)",
  },
});

const sidesClassNames = css({
  animation: `${cubeRotate} 1s linear infinite`,
  animationFillMode: "forwards",
  transformStyle: "preserve-3d",
  transform: "rotateX(-25.5deg) rotateY(45deg)",

  "*": {
    border: "10px solid $colors$clickable",
    borderRadius: "8px",
    background: "$colors$surface1",
  },

  ".top": {
    transform: "rotateX(90deg) translateZ(44px)",
    transformOrigin: "50% 50%",
  },
  ".bottom": {
    transform: "rotateX(-90deg) translateZ(44px)",
    transformOrigin: "50% 50%",
  },
  ".front": {
    transform: "rotateY(0deg) translateZ(44px)",
    transformOrigin: "50% 50%",
  },
  ".back": {
    transform: "rotateY(-180deg) translateZ(44px)",
    transformOrigin: "50% 50%",
  },
  ".left": {
    transform: "rotateY(-90deg) translateZ(44px)",
    transformOrigin: "50% 50%",
  },
  ".right": {
    transform: "rotateY(90deg) translateZ(44px)",
    transformOrigin: "50% 50%",
  },
});

export const Loading = ({
  className,
  showOpenInCodeSandbox,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  showOpenInCodeSandbox: boolean;
}): JSX.Element => {
  const c = useClasser(THEME_PREFIX);

  return (
    <div
      className={classNames(c("cube-wrapper"), wrapperClassName, className)}
      title="Open in CodeSandbox"
      {...props}
    >
      {showOpenInCodeSandbox && <OpenInCodeSandboxButton />}
      <div className={classNames(c("cube"), cubeClassName)}>
        <div className={classNames(c("sides"), sidesClassNames)}>
          <div className="top" />
          <div className="right" />
          <div className="bottom" />
          <div className="left" />
          <div className="front" />
          <div className="back" />
        </div>
      </div>
    </div>
  );
};
