import content from "../../website.config.json";

import { Box, Button, Text } from ".";

const command = content.commands.install;

export const Install: React.FC = () => {
  // TODO: feedback on copy (?)
  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
  };

  return (
    <Box
      css={{
        alignItems: "center",
        display: "flex",
        gap: "12px",
      }}
    >
      <Text
        css={{
          fontWeight: "$normal",
          fontSize: "16px",
          lineHeight: "19px",
          textAlign: "center",
          letterSpacing: "-0.05em",

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
        {command}
      </Text>
      <Button
        aria-label="Copy to cliboard"
        css={{
          color: "$darkTextPrimary",
          flexShrink: "0",
          height: "12px",
          width: "12px",
        }}
        onClick={copyToClipboard}
      >
        <svg fill="none" height="100%" viewBox="0 0 12 13" width="100%">
          <g clipPath="url(#a)">
            <path
              d="M8.21 1.344H2.317c-.54 0-.983.463-.983 1.03v7.212h.983V2.374H8.21v-1.03Zm1.474 2.06H4.281c-.54 0-.983.464-.983 1.03v7.213c0 .566.442 1.03.983 1.03h5.403c.54 0 .983-.464.983-1.03V4.435c0-.567-.442-1.03-.983-1.03Zm0 8.243H4.281V4.435h5.403v7.212Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path
                d="M0 0h12v12H0z"
                fill="currentColor"
                transform="translate(0 .676)"
              />
            </clipPath>
          </defs>
        </svg>
      </Button>
    </Box>
  );
};
