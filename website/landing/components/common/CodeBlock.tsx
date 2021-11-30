import {
  SandpackCodeViewer,
  SandpackProvider,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";

import { Box } from "./Box";

export const CodeBlock: React.FC = ({ children }) => {
  return (
    <Box
      css={{
        width: "100%",
        paddingTop: "30px !important",
        pre: { padding: 0 },

        ".sp-pre-placeholder": {
          overflow: "hidden",
          padding: "10px 5px",
        },

        ".cm-editor": {
          borderRadius: "16px",
          padding: "10px 5px",
        },
      }}
    >
      <SandpackProvider
        customSetup={{
          entry: "index.ts",
          files: { "index.ts": (children as string)?.trim() },
        }}
        initMode="immediate"
      >
        <SandpackThemeProvider theme="sandpack-dark">
          <SandpackCodeViewer />
        </SandpackThemeProvider>
      </SandpackProvider>
    </Box>
  );
};
