import content from "../../website.config.json";
import { Box, SectionHeader, CodeBlock, Text } from "../common";

export const Header: React.FC = () => {
  const { commands, intro } = content;

  return (
    <SectionHeader
      css={{
        gap: "40px",
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
      <Box css={{ maxWidth: "100%" }}>
        <CodeBlock>{commands.import}</CodeBlock>
      </Box>
    </SectionHeader>
  );
};
