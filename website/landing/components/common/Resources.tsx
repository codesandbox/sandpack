import { styled } from "../../stitches.config";
import content from "../../website.config.json";

import { List, ListItem, Text } from ".";

const ResourceLink = styled("a", {
  color: "inherit",
  transition: "color .2s ease",
  willChange: "color",

  "&:hover": {
    color: "$primary",
  },
});

export const Resources: React.FC = () => {
  return (
    <List
      css={{
        display: "flex",
      }}
    >
      {content.resources.map((r) => (
        <ListItem
          key={r.name}
          css={{
            margin: "0 1em",

            "@bp1": {
              margin: 0,
              "&:not(:last-of-type)": {
                marginRight: "2em",
              },
            },
          }}
        >
          <ResourceLink href={r.url}>
            <Text
              as="span"
              css={{
                fontFamily: "inherit",
                fontWeight: "$semiBold",
                letterSpacing: "-0.05em",

                "@bp2": {
                  fontSize: "2.4em",
                },
              }}
            >
              {r.name}
            </Text>
          </ResourceLink>
        </ListItem>
      ))}
    </List>
  );
};
