import Image from "next/image";

import { Box, Text } from "../common";

export const Footer: React.FC = () => {
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
        padding: "100px 0",
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
        powered by
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
