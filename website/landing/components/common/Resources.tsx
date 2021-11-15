import content from "../../website.config.json";

import { List, Text } from ".";

export const Resources: React.FC = () => {
  return (
    <List
      css={{
        display: "flex",
        gap: "48px",
      }}
    >
      {content.resources.map((r) => (
        <li key={r.name}>
          <a href={r.url}>
            <Text
              css={{
                fontWeight: "$semiBold",
                fontSize: "16px",
                lineHeight: "19px",
                textAlign: "center",
                letterSpacing: "-0.0125em",

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
          </a>
        </li>
      ))}
    </List>
  );
};
