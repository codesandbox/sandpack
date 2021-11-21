import { SandpackProvider } from "@codesandbox/sandpack-react";

import { Box, List } from "../common";

import { SandpackExample } from "./SandpackExample";
import { CustomExample } from "./Sections/Custom";
import { EditorExample } from "./Sections/Editor";
import { TemplateExample } from "./Sections/Template";
import { ThemeExample } from "./Sections/Theme";

export const Examples: React.FC = () => {
  return (
    <>
      <Box
        css={{
          position: "sticky",
          top: "calc(50vh - 25%)",
          right: 0,
          display: "none",

          "@bp2": {
            display: "block",
            transform: "translateX(50vw)",
          },

          "@media (min-width: 1300px)": {
            transform: "translateX(30vw)",
          },

          // TODO: test it out on big screens
          "@media (min-width: 2400px)": {
            transform: "translateX(20vw)",
          },

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
          <CustomExample />
        </SandpackProvider>

        <SandpackProvider>
          <EditorExample />
        </SandpackProvider>

        <ThemeExample />
      </List>
    </>
  );
};
