import {
  Sandpack,
  SandpackCodeViewer,
  SandpackProvider,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";
import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import "./style.css";

const RenderSandpack = (props) => {
  const { siteConfig } = useDocusaurusContext();
  const sandpackPluginOptions = siteConfig.themeConfig.sandpack;

  const {
    children,
    template = "react",
    file = "/App.js",
    theme = sandpackPluginOptions.theme,
  } = props;

  if (props.sandpack) {
    const occurrences = children
      .split(/(```(.*?[^\\])```)/gms)
      .filter((line) => line.startsWith("```"));

    const files = occurrences.reduce((acc, curr) => {
      const [firstLine, ...content] = curr.replace(/```/g, "").split("\n");
      const fileName = firstLine.match(/file=(.+)/)?.[1] ?? "";

      return {
        ...acc,
        [fileName]: {
          code: content.join("\n"),
        },
      };
    }, {});

    return (
      <Sandpack
        files={
          children
            ? occurrences.length
              ? files
              : { [file]: children }
            : undefined
        }
        template={template}
        theme={theme}
      />
    );
  }

  return (
    <SandpackProvider
      customSetup={{
        entry: "index.ts",
        files: { "index.ts": children.trim() },
      }}
    >
      <SandpackThemeProvider theme={theme}>
        <button
          className="sandpack__copy-button"
          onClick={() => {
            navigator.clipboard.writeText(children.trim());
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
        </button>
        <SandpackCodeViewer />
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};

export default RenderSandpack;
