import { Box, List } from "../common";
import { SandpackProvider } from "@codesandbox/sandpack-react";

import { SandpackExample } from "./SandpackExample";
import { TemplateExample } from "./Sections/Template";
import { ThemeExample } from "./Sections/Theme";
import { EditorExample } from "./Sections/Editor";

export const Examples: React.FC = () => {
  return (
    <>
      <Box
        css={{
          position: "sticky",
          top: "calc(50vh - (440px / 2))",
          marginRight: "-80%",

          "*": {
            transition: ".2s ease background, .2s ease color",
          },
        }}
      >
        <SandpackExample />
      </Box>
      <List
        css={{
          display: "flex",
          flexDirection: "column",
          gap: "148px",

          "@bp2": { gap: "0" },
        }}
      >
        <TemplateExample />
        <SandpackProvider>
          <EditorExample />
        </SandpackProvider>
        <ThemeExample />
      </List>
    </>
  );
};
