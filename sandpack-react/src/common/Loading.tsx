import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackTheme } from "..";
import { THEME_PREFIX } from "../styles";
import { buttonClassName } from "../styles/shared";
import { classNames } from "../utils/classNames";

import { OpenInCodeSandboxButton } from "./OpenInCodeSandboxButton";

const cubeClassName = {
  transform: "translate(-4px, 9px) scale(0.13, 0.13)",
  "*": { position: "absolute", width: "96px", height: "96px" },
};

// const cubeRotate = keyframes({
//   "0%": {
//     transform: "rotateX(-25.5deg) rotateY(45deg)",
//   },

//   "100%": {
//     transform: "rotateX(-25.5deg) rotateY(405deg)",
//   },
// });

const sidesClassNames = {
  //   animation: `${cubeRotate} 1s linear infinite`,
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
};

export const Loading = ({
  className,
  showOpenInCodeSandbox,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  showOpenInCodeSandbox: boolean;
}): JSX.Element => {
  const c = useClasser(THEME_PREFIX);
  const { css } = useSandpackTheme();

  return (
    <div
      className={classNames(
        c("cube-wrapper"),
        css({
          position: "absolute",
          right: "$space$2",
          bottom: "$space$2",
          zIndex: "$top",
          width: "32px",
          height: "32px",
          borderRadius: "$border$radius",

          [`.${css(cubeClassName)}`]: { display: "block" },
          [`.${css(buttonClassName)}`]: { display: "none" },
          [`&:hover .${css(buttonClassName)}`]: { display: "block" },
          [`&:hover .${css(cubeClassName)}`]: { display: "none" },
        }),
        className
      )}
      title="Open in CodeSandbox"
      {...props}
    >
      {showOpenInCodeSandbox && <OpenInCodeSandboxButton />}
      <div className={classNames(c("cube"), css(cubeClassName))}>
        <div className={classNames(c("sides"), css(sidesClassNames))}>
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
