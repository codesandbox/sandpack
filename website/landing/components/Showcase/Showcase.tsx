import content from "../../website.config.json";
import { Box, List, Text } from "../common";

const ContentLandmark = () => {
  return (
    <Box
      css={{
        alignItems: "center",
        background: "$surface",
        color: "white",
        display: "flex",
        height: "595px",
        justifyContent: "center",
        margin: "0 auto",
        width: "343px",

        "@bp1": {
          width: "384px",
        },

        "@bp2": {
          height: "540px",
          width: "360px",
        },

        "@bp3": {
          height: "720px",
          width: "480px",
        },
      }}
    >
      <Text>content landmark.</Text>
    </Box>
  );
};

export const Showcase: React.FC = () => {
  const { showCase } = content;

  return (
    <Box
      as="section"
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "200px",
        justifyContent: "center",
        padding: "200px 16px",

        "@bp2": {
          padding: "200px 0 0",
        },
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
        dangerouslySetInnerHTML={{ __html: showCase.title }}
      />
      <List
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "148px",
          width: "100%",

          "@bp2": {
            display: "grid",
            gap: "200px",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        {showCase.highlights.map((h, index) => (
          <Box
            key={`section-showcase-${index}`}
            as="li"
            css={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: "40px",

              "@bp1": {
                width: "384px",
              },

              "@bp2": {
                width: "360px",

                "&:nth-of-type(odd)": {
                  justifySelf: "flex-end",
                },

                "&:ntt-of-type(even)": {
                  justifySelf: "flex-start",
                },
              },

              "@bp3": {
                width: "480px",
              },
            }}
          >
            <ContentLandmark />
            <Box
              css={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
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
                  },
                }}
              >
                {h.description}
              </Text>
            </Box>
          </Box>
        ))}
      </List>
    </Box>
  );
};
