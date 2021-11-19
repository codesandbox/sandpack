import { Box, List } from "../common";

import { SandpackExample } from "./SandpackExample";
import { TemplateExample } from "./Sections/Template";
import { ThemeExample } from "./Sections/Theme";

export const Examples: React.FC = () => {
  return (
    <>
      <Box
        css={{
          position: "sticky",
          top: "calc(50vh - (440px / 2))",
          marginRight: "-80%",
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
        <ThemeExample />
      </List>
    </>
  );
};
