import { Sandpack } from "@codesandbox/sandpack-react";
import CodeBlock from "@theme-init/CodeBlock";
import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import "./style.css";

const RenderSandpack = (props) => {
  const { siteConfig } = useDocusaurusContext();
  const sandpackPluginOptions = siteConfig.themeConfig.sandpack;

  if (props.sandpack) {
    const {
      children,
      template = "react",
      file = "/App.js",
      theme = sandpackPluginOptions.theme,
    } = props;

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
        files={occurrences.length ? files : { [file]: children }}
        template={template}
        theme={theme}
      />
    );
  }

  return <CodeBlock {...props} />;
};

export default RenderSandpack;
