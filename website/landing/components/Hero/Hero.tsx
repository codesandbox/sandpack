import {
  Box,
  Install,
  Resources,
  SandpackLogo,
  SandpackPreview,
  Text,
} from "../common";

export const Hero: React.FC = () => {
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
              width: "280px",
            }}
          >
            Bring the power of CodeSandbox live coding into your project.
          </Text>
        </Box>
      </Box>
      <Install />
      <Resources />
      <Box css={{ display: "flex", justifyContent: "center" }}>
        <SandpackPreview />
      </Box>
    </Box>
  );
};
