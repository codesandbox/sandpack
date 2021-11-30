import {
  SandpackCodeViewer,
  SandpackProvider,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";

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
        width: "100%",
        paddingTop: "30px !important",
        pre: { padding: 0 },

        ".sp-pre-placeholder": {
          overflow: "hidden",
        },

        ".cm-editor": {
          borderRadius: oneLiner ? "78px" : "16px",
          padding: "10px 5px",
        },
      }}
    >
      <SandpackProvider
        customSetup={{
          entry: "index.ts",
          files: { "index.ts": (children as string)?.trim() },
        }}
        initMode="user-visible"
      >
        <SandpackThemeProvider theme="sandpack-dark">
          <SandpackCodeViewer />
        </SandpackThemeProvider>
      </SandpackProvider>
    </Box>
  );
};
