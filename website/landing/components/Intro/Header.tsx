import content from "../../website.config.json";
import { Box, CodeBlock, Text } from "../common";

export const Header: React.FC = () => {
  const { commands, intro } = content;

  return (
    <Box
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "64px",
        marginBottom: "100px",
        overflow: "hidden",
      }}
    >
      <Text
        as="h2"
        css={{
          fontSize: "36px",
          fontWeight: "$semiBold",
          letterSpacing: "-0.05em",
          lineHeight: "1",
          textAlign: "center",

          "@bp1": {
            fontSize: "72px",
          },

          "@bp2": {
            fontSize: "96px",
          },

          "@bp3": {
            fontSize: "144px",
          },
        }}
        dangerouslySetInnerHTML={{ __html: intro.title }}
      />
      <Box
        css={{
          maxWidth: "calc(100vw - 16px)",
        }}
      >
        <CodeBlock oneLiner>{commands.import}</CodeBlock>
      </Box>
    </Box>
  );
};
