import { Sandpack } from "@codesandbox/sandpack-react";
import CodeBlock from "@theme-init/CodeBlock";
import React from "react";

import "./style.css";

const RenderSandpack = (props) => {
  if (props.sandpack) {
    const {
      children,
      template = "react",
      file = "/App.js",
      theme = "codesandbox-light",
    } = props;

    return (
      <Sandpack
        files={{ [file]: { code: children } }}
        template={template}
        theme={theme}
      />
    );
  }

  return <CodeBlock {...props} />;
};

export default RenderSandpack;
