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

  const { children, template = "react", file = "/App.js", theme = sandpackPluginOptions.theme } = props;

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
        files={children ? occurrences.length ? files : { [file]: children } : undefined}
        template={template}
        theme={theme}
      />
    );
  }

  return (
    <SandpackProvider
      customSetup={{ entry: "index.ts", files: { "index.ts": children.trim() } }}
    >
      <SandpackThemeProvider theme={theme}>
        <SandpackCodeViewer />
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};

export default RenderSandpack;
