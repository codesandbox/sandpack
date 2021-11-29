import type { SandpackProps } from "@codesandbox/sandpack-react";
import { Sandpack } from "@codesandbox/sandpack-react";

import { styled } from "../../stitches.config";

export const SandpackContainer = styled("div", {
  alignItems: "center",
  display: "flex",
  overflow: "hidden",
  width: "100%",

  ".custom-wrapper": {
    "--sp-border-radius": "10px",
    width: "100%",
  },

  ".custom-layout": {
    width: "100%",
    height: "512px",
    border: 0,

    "@bp1": {
      width: "384px",
      height: "608px",
    },

    "@bp2": {
      height: "448px",
      width: "996px",
    },

    "@bp3": {
      height: "40vh",
    },
  },

  ".custom-stack": {
    "@bp2": {
      height: "100% !important",
      width: "100% !important",
    },
  },
});

export const SandpackPreview: React.FC<{ options?: SandpackProps }> = ({
  options,
}) => {
  return (
    <SandpackContainer>
      <Sandpack
        template="react"
        theme="sandpack-dark"
        {...options}
        options={{
          initMode: "user-visible",
          ...(options?.options ?? {}),
          classes: {
            "sp-layout": "custom-layout",
            "sp-stack": "custom-stack",
            "sp-wrapper": "custom-wrapper",
          },
        }}
      />
    </SandpackContainer>
  );
};
