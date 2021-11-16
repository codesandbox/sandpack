import content from "../../website.config.json";
import { Box, List, SandpackLogo, Text } from "../common";

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
          width: "376px",
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

export const Api: React.FC = () => {
  const { api } = content;

  return (
    <Box
      as="section"
      css={{
        alignItems: "center",
        background: "$lightBackground",
        color: "$lightTextPrimary",
        display: "flex",
        flexDirection: "column",
        gap: "100px",
        padding: "200px 16px 100px",
      }}
    >
      <Box
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <Box
          css={{
            width: "60px",
            "@bp1": {
              width: "100px",
            },
            "@bp2": {
              width: "120px",
            },
            "@bp3": {
              width: "150px",
            },
          }}
        >
          <SandpackLogo />
        </Box>
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
          dangerouslySetInnerHTML={{ __html: api.title }}
        />
      </Box>
      <List
        css={{
          display: "flex",
          flexDirection: "column",
          gap: "148px",
          width: "100%",

          "@bp2": {
            gap: "0",

            ":nth-child(even)": {
              flexDirection: "row-reverse",
            },
          },
        }}
      >
        {api.highlights.map((h, index) => (
          <Box
            key={`section-api-${index}`}
            as="li"
            css={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
              justifyContent: "center",

              "@bp2": {
                flexDirection: "row",
                gap: "0",
                height: "100%",
                minHeight: "100vh",
              },
            }}
          >
            <Box
              css={{
                "@bp2": {
                  flex: "1",
                  flexShrink: "0",
                },
              }}
            >
              <ContentLandmark />
            </Box>
            <Box
              css={{
                "@bp2": {
                  flex: "1",
                  flexShrink: "0",
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
              </Box>
            </Box>
          </Box>
        ))}
      </List>
    </Box>
  );
};
