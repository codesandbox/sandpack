import Image from "next/image";

import content from "../../website.config.json";
import { Box, Text } from "../common";

export const Footer: React.FC = () => {
  const { footer } = content;

  return (
    <Box
      aria-labelledby="footer-label"
      as="footer"
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        flexShrink: "O",
        padding: "50px 0",

        "@bp2": {
          padding: "100px 0",
        },
      }}
    >
      <Text
        css={{
          fontFamily: "$base",
          fontWeight: "$normal",
          fontSize: "12px",
          lineHeight: "15px",
          textAlign: "center",
          letterSpacing: "-0.0125em",
        }}
        id="footer-label"
      >
        {footer.text}
      </Text>
      <Image
        alt="CodeSandbox"
        height={32}
        src="/assets/logos/CodeSandbox.svg"
        width={198}
      />
    </Box>
  );
};
