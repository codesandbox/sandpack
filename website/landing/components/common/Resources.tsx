import { List, Text } from ".";

const RESOURCES = [
  { name: "Docs", link: "" },
  { name: "GitHub", link: "" },
];

export const Resources: React.FC = () => {
  return (
    <List
      css={{
        display: "flex",
        gap: "48px",
      }}
    >
      {RESOURCES.map((r) => (
        <li key={r.name}>
          <a href={r.link}>
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
                }
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
