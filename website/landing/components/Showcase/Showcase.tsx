import content from "../../website.config.json";
import {
  Box,
  List,
  ListItem,
  SectionWrapper,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  Card,
  CardTitle,
  CardDescription,
  Text,
} from "../common";

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
    <SectionWrapper>
      <SectionContainer>
        <SectionHeader>
          <SectionTitle dangerouslySetInnerHTML={{ __html: showCase.title }} />
        </SectionHeader>
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
            <ListItem
              key={`section-showcase-${index}`}
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
              <Card css={{ alignItems: "center" }}>
                <CardTitle
                  dangerouslySetInnerHTML={{
                    __html: h.title,
                  }}
                />
                <CardDescription
                  css={{ textAlign: "center" }}
                  dangerouslySetInnerHTML={{
                    __html: h.description,
                  }}
                />
              </Card>
            </ListItem>
          ))}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
