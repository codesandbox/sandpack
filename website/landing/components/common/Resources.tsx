import { styled } from "../../stitches.config";
import content from "../../website.config.json";

import { List, Text } from ".";

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
    <List css={{ display: "flex" }}>
      {content.resources.map((r) => (
        <li key={r.name}>
          <ResourceLink href={r.url}>
            <Text
              css={{
                fontWeight: "$semiBold",
                fontSize: "16px",
                lineHeight: "19px",
                textAlign: "center",
                letterSpacing: "-0.0125em",
                margin: "0 24px",

                "@bp1": {
                  fontSize: "18px",
                  lineHeight: "22px",
                },

                "@bp2": {
                  fontSize: "24px",
                  lineHeight: "29px",
                },
              }}
            >
              {r.name}
            </Text>
          </ResourceLink>
        </li>
      ))}
    </List>
  );
};
