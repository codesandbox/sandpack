import {
  SandpackCodeViewer,
  SandpackProvider,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";

import { sandpackTheme } from "../../styles/sandpackTheme";

import { Box } from "./Box";

interface CodeBlockProps {
  oneLiner?: boolean;
}
export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  oneLiner = false,
}) => {
  return (
    <Box
      css={{
        pre: { padding: 0 },

        ".cm-editor": {
          borderRadius: oneLiner ? "78px" : "16px",
          padding: "15px",
        },
      }}
    >
      <SandpackProvider
        customSetup={{
          entry: "index.ts",
          files: { "index.ts": (children as string)?.trim() },
        }}
      >
        <SandpackThemeProvider theme={sandpackTheme}>
          <SandpackCodeViewer />
        </SandpackThemeProvider>
      </SandpackProvider>
    </Box>
  );
};
