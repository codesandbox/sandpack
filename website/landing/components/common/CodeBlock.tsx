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
      <SandpackProvider
        customSetup={{ entry: "index.ts" }}
        files={{ "index.ts": (children as string)?.trim() }}
        options={{ initMode: "immediate" }}
      >
        <SandpackThemeProvider theme={sandpackDark}>
          <SandpackCodeViewer />
        </SandpackThemeProvider>
      </SandpackProvider>
    </Box>
  );
};
