import Image from "next/image";

import { styled } from "../../stitches.config";
import content from "../../website.config.json";
import { Box, List, Text } from "../common";

const Divider = styled("div", {
  border: "1px solid $darkTextPrimary",
  margin: "100px 0px",
  width: "50px",
});

const Title = styled("h3", {
  fontFamily: "$base",
  fontSize: "24px",
  fontWeight: "$semiBold",
  letterSpacing: "-0.05em",
  lineHeight: "100%",
  margin: "0",
  maxWidth: "45%",
  textAlign: "center",

  "@bp1": {
    fontSize: "36px",
    maxWidth: "35%",
  },

  "@bp2": {
    fontSize: "48px",
    maxWidth: "25%",
  },
});

const CommunityLink = styled("a", {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  width: "75%",

  "@bp1": {
    width: "50%",
  },

  "@bp2": {
    alignItems: "flex-start",
    width: "240px",
  },
});

export const Community: React.FC = () => {
  const { community } = content;

  return (
    <Box
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "200px",
      }}
    >
      <Divider />
      <Box
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "200px",
          width: "100%",
        }}
      >
        <Title>{community.title}</Title>
        <List
          css={{
            display: "flex",
            flexDirection: "column",
            gap: "120px",
            justifyContent: "center",

            "@bp2": {
              flexDirection: "row",
            },
          }}
        >
          {community.communities.map((c) => (
            <li key={c.name}>
              <CommunityLink href={c.socialUrl} target="_blank">
                <Image alt="" height={32} src={c.logoUrl} width={32} />
                <Text
                  css={{
                    fontWeight: "$semiBold",
                    fontSize: "24px",
                    lineHeight: "29px",
                    margin: "16px 0 12px",
                    textAlign: "center",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {c.name}
                </Text>
                <Text
                  css={{
                    color: "$darkTextSecondary",
                    fontSize: "16px",
                    lineHeight: "140%",
                    textAlign: "center",
                    letterSpacing: "-0.015em",

                    "@bp2": {
                      textAlign: "start",
                    },
                  }}
                >
                  {c.description}
                </Text>
              </CommunityLink>
            </li>
          ))}
        </List>
      </Box>
    </Box>
  );
};
