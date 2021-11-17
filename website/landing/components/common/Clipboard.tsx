import content from "../../website.config.json";

import { Box, Button, Text } from ".";
import { styled } from "../../stitches.config";
import { useCallback, useEffect, useState } from "react";

const command = content.commands.install;

const ClipboardToast = styled("div", {
  $$toastHeight: "48px",
  alignItems: "center",
  borderRadius: "72px",
  background: "$primary",
  display: "flex",
  color: "$lightTextPrimary",
  gap: "10px",
  height: "$$toastHeight",
  left: "50%",
  opacity: "0",
  padding: "0 16px",
  pointerEvents: "none",
  position: "absolute",
  top: 0,
  transform: "translateY(100vh) translateX(-50%)",
  transition: "opacity .5s ease, transform .5s ease",
  zIndex: "-1",

  p: {
    fontWeight: "$normal",
    fontSize: "18px",
    lineHeight: "22px",
    letterSpacing: "-0.025em",
    margin: 0,
  },

  "@bp3": {
    $$toastHeight: "64px",
  },

  variants: {
    visible: {
      true: {
        opacity: "1",
        transform:
          "translateY(calc(100vh - 2 * $$toastHeight)) translateX(-50%)",
        zIndex: "10",
      },
    },
  },
});

export const Clipboard: React.FC = () => {
  const [toastVisible, setToastVisible] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(command);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToastVisible(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toastVisible]);

  return (
    <>
      {/* TODO: implement toast notification system */}
      <ClipboardToast visible={toastVisible}>
        <Box
          css={{
            display: "flex",
            height: "16px",
            width: "16px",

            "@bp3": {
              height: "24px",
              width: "24px",
            },
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
              fill="currentColor"
            />
          </svg>
        </Box>
        <p>Copied to clipboard</p>
      </ClipboardToast>
      <Button
        css={{
          alignItems: "center",
          color: "$darkTextPrimary",
          cursor: "pointer",
          display: "flex",
          gap: "12px",
          transition: "color .2s ease", // TODO: verify transition
          willChange: "color",

          "&:hover": {
            color: "$primary",
          },
        }}
        onClick={copyToClipboard}
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
        <Box
          aria-label="Copy to cliboard"
          css={{
            flexShrink: "0",
            height: "12px",
            width: "12px",
            top: 1,
            position: "relative",

            "@bp2": {
              height: "16px",
              width: "16px",
            },
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
        </Box>
      </Button>
    </>
  );
};
