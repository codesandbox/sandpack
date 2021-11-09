import { content } from "../../content/showcase-section";
import { Box, List, Text, TextHighlight } from "../common";

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
          width: "80%",

          "@bp1": {
            fontSize: "72px",
            width: "64%",
          },

          "@bp2": {
            fontSize: "96px",
            width: "52%",
          },

          "@bp3": {
            fontSize: "144px",
            width: "56%",
          },
        }}
      >
        {content.title.map(({ text, highlight }, index) => {
          const renderedText = `${text}${
            index < content.title.length - 1 ? " " : ""
          }`;

          return highlight ? (
            <TextHighlight className="highlight">{renderedText}</TextHighlight>
          ) : (
            renderedText
          );
        })}
      </Text>
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
        {content.features.map((f, index) => (
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
                margin: "0 auto",
                width: "360px",
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
                {f.title}
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
                {f.description}
              </Text>
            </Box>
          </Box>
        ))}
      </List>
    </Box>
  );
};
