import content from "../../website.config.json";
import { Box, CodeBlock, List, SandpackPreview, Text } from "../common";

export const Intro: React.FC = () => {
  const { intro, commands } = content;

  return (
    <Box
      as="section"
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "200px 16px 0",
        width: "100%",
      }}
    >
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
      <Box css={{ display: "none", "@bp2": { display: "block" } }}>
        <SandpackPreview />
      </Box>
      <List
        css={{
          display: "flex",
          flexDirection: "column",
          gap: "148px",

          "@bp2": { gap: "0" },
        }}
      >
        {intro.highlights.map((h, index) => (
          <Box
            key={`section-intro-${index}`}
            as="li"
            css={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "48px",

              "@bp2": {
                alignItems: "center",
                justifyContent: "center",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                height: "100%",
                minHeight: "100vh",
              },
            }}
          >
            <Box
              css={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                margin: "0 auto",
                width: "344px",

                "@bp1": {
                  width: "376px",
                },

                "@bp2": {
                  width: "360px",
                },

                "@bp3": {
                  width: "480px",
                },
              }}
            >
              <Text
                css={{
                  fontSize: "24px",
                  fontWeight: "$semiBold",
                  letterSpacing: "-0.05em",
                  lineHeight: "1.2",
                  textAlign: "center",

                  "@bp1": {
                    fontSize: "36px",
                  },

                  "@bp2": {
                    textAlign: "start",
                  },
                }}
              >
                {h.title}
              </Text>
              <Text
                css={{
                  color: "$darkTextSecondary",
                  fontSize: "16px",
                  lineHeight: "1.4",
                  letterSpacing: "-0.025em",
                  textAlign: "center",

                  "@bp2": {
                    fontSize: "18px",
                    textAlign: "start",
                  },
                }}
                dangerouslySetInnerHTML={{ __html: h.description }}
              />
              {h.snippet && <CodeBlock>{h.snippet}</CodeBlock>}
            </Box>
            <SandpackPreview />
          </Box>
        ))}
      </List>
    </Box>
  );
};
