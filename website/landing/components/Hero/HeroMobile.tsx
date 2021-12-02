import {
  Box,
  Clipboard,
  Resources,
  SandpackLogo,
  SandpackPreview,
  Text,
} from "../common";

export const HeroMobile: React.FC = () => {
  return (
    <Box
      as="section"
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "50px",
        height: "100%",
        minHeight: "100vh",
        padding: "100px 16px 0",
        overflow: "hidden",
        width: "100%",

        "@bp2": {
          background: "$surface",
        },
      }}
    >
      <Box
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        <Box css={{ width: "60px", "@bp1": { width: "100px" } }}>
          <SandpackLogo theme="light" />
        </Box>
        <Box
          css={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Text
            as="h1"
            css={{
              fontWeight: "$semiBold",
              fontSize: "36px",
              lineHeight: "100%",
              textAlign: "center",
              letterSpacing: "-0.05em",

              "@bp1": {
                fontSize: "72px",
              },
            }}
          >
            Sandpack
          </Text>
          <Text
            css={{
              color: "$darkTextSecondary",
              fontSize: "16px",
              fontWeight: "$normal",
              lineHeight: "19px",
              letterSpacing: "-0.0125em",
              textAlign: "center",
              maxWidth: "320px",
            }}
          >
            A component toolkit for creating
            <br /> live-running code editing experiences,
            <br /> using the power of CodeSandbox.
          </Text>
        </Box>
      </Box>
      <Clipboard />
      <Resources />
      <Box css={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <SandpackPreview />
      </Box>
    </Box>
  );
};
