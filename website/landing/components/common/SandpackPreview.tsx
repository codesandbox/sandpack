import type { SandpackInitMode } from "@codesandbox/sandpack-react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";

import { sandpackTheme } from "../../styles/sandpackTheme";

import { Box } from "./Box";

export const SandpackPreview: React.FC = () => {
  const [initMode, setInitMode] = useState<SandpackInitMode>("lazy");

  useEffect(() => {
    const t0 = performance.now();
    new Array(100000).forEach(console.log);
    const t1 = performance.now();

    setInitMode(t1 - t0 > 1 ? "user-visible" : "lazy");
  }, []);

  return (
    <Box
      css={{
        alignItems: "center",
        display: "flex",
        overflow: "hidden",
        width: "100%",

        ".custom-layout": {
          width: "342px",
          height: "512px",

          "@bp1": {
            width: "384px",
            height: "608px",
          },

          "@bp2": {
            height: "448px",
            width: "996px",
          },

          "@bp3": {
            height: "664px",
            width: "1328px",
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
        options={{
          initMode,
          classes: {
            "sp-layout": "custom-layout",
            "sp-stack": "custom-stack",
          },
        }}
        template="react"
        theme={sandpackTheme}
      />
    </Box>
  );
};
