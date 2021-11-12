import content from "../../website.config.json";
import { Box, List, Text } from "../common";

import { ICONS } from "./icons";

export const Features: React.FC = () => {
  const { features } = content;

  return (
    <Box
      as="section"
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "100px",
        justifyContent: "center",
        padding: "200px 16px",

        "@bp1": {
          gap: "200px",
        },

        "@bp2": {
          width: "64%",
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
            fontSize: "64px",
          },

          "@bp2": {
            alignSelf: "flex-start",
            fontSize: "72px",
            textAlign: "start",
          },

          "@bp3": {
            fontSize: "96px",
          },
        }}
        dangerouslySetInnerHTML={{ __html: features.title }}
      />
      <List
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "120px",
          width: "100%",

          "@bp2": {
            alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "space-between",
          },
        }}
      >
        {features.highlights.map((h, index) => {
          const icon = ICONS[h.iconKey as keyof typeof ICONS];

          return (
            <Box
              key={`section-features-${index}`}
              as="li"
              css={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
                width: "256px",

                "@bp2": {
                  alignItems: "flex-start",
                  width: "240px",
                },

                "@bp3": {
                  width: "320px",
                },
              }}
            >
              <Box
                css={{
                  alignItems: "center",
                  color: "$lightTextPrimary",
                  background: "$primary",
                  borderRadius: "100%",
                  display: "flex",
                  flexShrink: "0",
                  flexGrow: "0",
                  height: "78px",
                  justifyContent: "center",
                  padding: "18px",
                  width: "78px",
                }}
              >
                {icon}
              </Box>
              <Box
                css={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Text
                  css={{
                    fontSize: "24px",
                    fontWeight: "$normal",
                    letterSpacing: "-0.05em",
                    lineHeight: "1.2",
                    textAlign: "center",

                    "@bp1": {
                      fontSize: "36px",
                    },

                    "@bp2": {
                      textAlign: "start",
                    },

                    "@bp3": {
                      fontSize: "24px",
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
                    letterSpacing: "-0.05em",
                    textAlign: "center",

                    "@bp2": {
                      fontSize: "18px",
                      textAlign: "start",
                    },
                  }}
                >
                  {h.description}
                </Text>
              </Box>
            </Box>
          );
        })}
      </List>
    </Box>
  );
};
