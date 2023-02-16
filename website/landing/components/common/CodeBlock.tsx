import {
  SandpackCodeViewer,
  SandpackProvider,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";

import { Box } from "./Box";

export const CodeBlock: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box
      css={{
        width: "100%",
        paddingTop: "30px !important",
        pre: { padding: 0 },

        ".cm-scroller": {
          padding: "var(--sp-space-3) 0 !important",
        },

        ".sp-code-editor": {
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      <SandpackProvider>
        <SandpackThemeProvider theme={sandpackDark}>
          <SandpackCodeViewer code={(children as string)?.trim()} />
        </SandpackThemeProvider>
      </SandpackProvider>
    </Box>
  );
};
