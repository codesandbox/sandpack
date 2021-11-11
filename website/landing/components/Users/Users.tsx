import Image from "next/image";

import { styled } from "../../stitches.config";
import content from "../../website.config.json";
import { Box, List, Text } from "../common";

const UserLink = styled("a", {
  display: "block",
  maxWidth: "75%",
  margin: "0 auto",
  position: "relative",

  img: {
    objectFit: "contain",
    objectPosition: "center",
  },

  "@bp1": {
    maxWidth: "100%",
  },
});

export const Users: React.FC = () => {
  const { users } = content;

  return (
    <Box
      as="section"
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "100px",
        padding: "100px 0",

        "@bp1": {
          padding: "200px 0",
        },
      }}
    >
      <Text
        css={{
          fontWeight: "$semiBold",
          fontSize: "18px",
          lineHeight: "1.2",
          textAlign: "center",
          letterSpacing: "-0.0125em",
        }}
      >
        {users.title}
      </Text>
      <List
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
          justifyContent: "center",

          "@bp1": {
            gap: "100px",
          },

          "@bp2": {
            flexDirection: "row",
          },
        }}
      >
        {users.list.map((u) => {
          const { url, height, width } = u.logo;

          return (
            <li key={u.name}>
              <UserLink
                href={u.socialUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Image alt={u.name} height={height} src={url} width={width} />
              </UserLink>
            </li>
          );
        })}
      </List>
    </Box>
  );
};
