import content from "../../website.config.json";

import { Box, Button, Text } from ".";
import { useClipboard } from "./ClipboardProvider";

export const Clipboard: React.FC = () => {
  const { copyToClipboard } = useClipboard();

  return (
    <Button
      aria-label="Copy to clipboard"
      css={{
        alignItems: "center",
        color: "$darkTextPrimary",
        cursor: "pointer",
        display: "flex",
        transition: "color .2s ease",
        willChange: "color",

        "> div": {
          opacity: 0,
          transition: "opacity .2s ease",
          willChange: "opacity",
        },

        "&:hover": {
          color: "$primary",

          "> div": {
            opacity: 1,
          },
        },
      }}
      onClick={copyToClipboard}
    >
      <Text
        as="span"
        css={{
          fontFamily: "inherit",
          letterSpacing: "-0.05em",

          "@bp2": {
            fontSize: "2.4em",
          },
        }}
      >
        {content.commands.install}
      </Text>
      <Box
        css={{
          flexShrink: "0",
          height: "12px",
          width: "12px",
          top: 1,
          position: "relative",
          marginLeft: "12px",

          "@bp2": {
            height: "16px",
            width: "16px",
          },
        }}
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
      </Box>
    </Button>
  );
};
