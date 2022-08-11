import React, { useState } from "react";
import * as themes from "@codesandbox/sandpack-themes";
import { Sandpack } from "@codesandbox/sandpack-react";
import CodeBlock from "@codesandbox/sandpack-docusaurus/src/theme/CodeBlock";

export default () => {
  const [current, setCurrent] = useState("githubLight");

  const codeBlock = `import { ${current} } from "@codesandbox/sandpack-themes";

<Sandpack theme={${current}} />;`;

  return (
    <div>
      <label>
        Try out:
        <select
          style={{ marginLeft: ".5em" }}
          defaultValue="githubLight"
          onChange={({ target }) => setCurrent(target.value)}
        >
          {Object.keys(themes).map((themeName) => (
            <option>{themeName}</option>
          ))}
        </select>
      </label>

      <br />
      <br />

      <CodeBlock>{codeBlock}</CodeBlock>

      <Sandpack
        options={{
          showLineNumbers: true,
          showInlineErrors: true,
          showNavigator: true,
          showTabs: true,
          closableTabs: true,
          visibleFiles: [
            "/App.js",
            "/index.js",
            "/public/index.html",
            "/styles.css",
          ],
        }}
        template="react"
        theme={themes[current]}
      />
    </div>
  );
};