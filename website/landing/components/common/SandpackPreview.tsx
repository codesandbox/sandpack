import type { SandpackProps } from "@codesandbox/sandpack-react";
import { Sandpack } from "@codesandbox/sandpack-react";

import { Box } from "./Box";

export const SandpackPreview: React.FC<{ options?: SandpackProps }> = ({
  options,
}) => {
  return (
    <Box
      css={{
        alignItems: "center",
        display: "flex",
        overflow: "hidden",
        width: "100%",

        ".custom-wrapper": {
          "--sp-border-radius": "10px",
        },

        ".custom-layout": {
          width: "342px",
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
      }}
    >
      <Sandpack
        template="react"
        theme="sandpack-dark"
        {...options}
        options={{
          ...(options?.options ?? {}),
          classes: {
            "sp-layout": "custom-layout",
            "sp-stack": "custom-stack",
            "sp-wrapper": "custom-wrapper",
          },
        }}
      />
    </Box>
  );
};
