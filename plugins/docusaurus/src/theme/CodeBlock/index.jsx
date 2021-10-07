import { Sandpack } from "@codesandbox/sandpack-react";
import CodeBlock from "@theme-init/CodeBlock";

import "./style.css";

const RenderSandpack = (props) => {
  const { sandpack, children } = props;

  if (sandpack) {
    return (
      <Sandpack
        files={{ "/src/index.js": { code: children } }}
        template="vanilla"
      />
    );
  }

  return <CodeBlock {...props} />;
};

export default RenderSandpack;
