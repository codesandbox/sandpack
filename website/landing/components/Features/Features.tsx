import config from "../../website.config.json";
import {
  Box,
  Card,
  CardDescription,
  CardTitle,
  List,
  ListItem,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionWrapper,
} from "../common";

import { ICONS } from "./icons";

export const Features: React.FC = () => {
  const content = config.features;

  return (
    <SectionWrapper>
      <SectionContainer
        css={{
          "@bp2": {
            maxWidth: "65%",
          },
        }}
      >
        <SectionHeader css={{ "@bp2": { alignItems: "flex-start" } }}>
          <SectionTitle
            css={{ "@bp2": { textAlign: "start" } }}
            dangerouslySetInnerHTML={{ __html: content.title }}
          />
        </SectionHeader>
        <List
          css={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: "48px",
            justifyContent: "center",
            transition: "opacity .5s cubic-bezier(0.770, 0.000, 0.175, 1.000)",

            "@bp1": {
              gap: "100px",
            },

            "@bp2": {
              alignItems: "flex-start",
              flexDirection: "row",
              flexFlow: "row wrap",
              margin: "100px 0 200px",
              justifyContent: "space-between",
            },
          }}
        >
          {content.highlights.map((h, index) => {
            const icon = ICONS[h.iconKey as keyof typeof ICONS];

            return (
              <ListItem key={`content-highlight-${index}`}>
                <Card size="small">
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
                      marginBottom: "20px",
                      padding: "18px",
                      width: "78px",
                    }}
                  >
                    {icon}
                  </Box>
                  <CardTitle size="small">{h.title}</CardTitle>
                  <CardDescription size="small">
                    {h.description}
                  </CardDescription>
                </Card>
              </ListItem>
            );
          })}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
