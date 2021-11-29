import { styled } from "../../stitches.config";
import content from "../../website.config.json";

import { List, ListItem, Text } from ".";

const ResourceLink = styled("a", {
  color: "inherit",
  transition: "color .2s ease", // TODO: verify transition
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
            "&:not(:last-of-type)": {
              marginRight: "2em",
            },
          }}
        >
          <ResourceLink href={r.url}>
            <Text
              as="span"
              css={{
                fontFamily: "inherit",
                fontWeight: "$semiBold",
                fontSize: "2.4em",
                letterSpacing: "-0.05em",
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
