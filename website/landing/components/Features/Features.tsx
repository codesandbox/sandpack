import { content } from "../../content/features-section";
import { Box, List, Text, TextHighlight } from "../common";

const ICONS_MAP = {
  editor: () => (
    <svg fill="none" height="42" viewBox="0 0 43 42" width="43">
      <path
        d="M7.5 18v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2ZM35.5 20h-8.172c-1.781 0-2.674-2.154-1.414-3.414l8.172-8.172c1.26-1.26 3.414-.367 3.414 1.414V18a2 2 0 0 1-2 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <circle
        cx="23"
        cy="30.5"
        r="6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  ),
  preview: () => (
    <svg fill="none" height="42" viewBox="0 0 43 42" width="43">
      <path
        d="M16.5 26h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-17a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  ),
  export: () => (
    <svg fill="none" height="42" viewBox="0 0 43 42" width="43">
      <path
        d="M10.5 16v14a2 2 0 0 0 2 2h19a2 2 0 0 0 2-2V16M9.5 12a2 2 0 0 1 2-2h21a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-21a2 2 0 0 1-2-2v-2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  ),
};

export const Features: React.FC = () => {
  return (
    <Box
      as="section"
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "200px",
          justifyContent: "center",
          padding: "200px 0",

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
              width: "64%",
            },

            "@bp2": {
              alignSelf: "flex-start",
              fontSize: "72px",
              textAlign: "start",
              width: "40%",
            },

            "@bp3": {
              fontSize: "96px",
              width: "44%",
            },
          }}
        >
          {content.title.map(({ text, highlight }, index) => {
            const renderedText = `${text}${
              index < content.title.length - 1 ? " " : ""
            }`;

            return highlight ? (
              <TextHighlight className="highlight">
                {renderedText}
              </TextHighlight>
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
            gap: "120px",
            width: "100%",

            "@bp2": {
              alignItems: "flex-start",
              flexDirection: "row",
              justifyContent: "space-between",
            },
          }}
        >
          {content.features.map((f, index) => {
            const icon = ICONS_MAP[f.iconKey as keyof typeof ICONS_MAP];

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
                    width: "78px",
                  }}
                >
                  {icon()}
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
                    {f.title}
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
                    {f.description}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};
