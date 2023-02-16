import {
  Sandpack,
  SandpackCodeViewer,
  SandpackProvider,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import * as themes from "@codesandbox/sandpack-themes";
import { useTheme } from "next-themes";
import { useState } from "react";

import { ThemesList } from "./ThemesList";

export default function Themes() {
  const [current, setCurrent] = useState("amethyst");
  const { theme } = useTheme();

  const getTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? themes.sandpackDark
        : "light";
    }

    if (theme === "dark") return themes.sandpackDark;

    return "light";
  };

  const predefinedThemes = ["auto", "dark", "light"].includes(current);
  const codeBlock = predefinedThemes
    ? `// Predefined theme
    
<Sandpack theme="${current}" />`
    : `import { ${current} } from "@codesandbox/sandpack-themes";

<Sandpack theme={${current}} />;`;

  return (
    <div>
      <h3 className="nx-font-semibold nx-tracking-tight nx-mt-8 nx-text-2xl">
        Try it out ({Object.keys(themes).length} total):
      </h3>

      <ThemesList current={current} setCurrent={setCurrent} />

      <br />

      <SandpackProvider theme={getTheme()}>
        <SandpackLayout style={{ "--sp-layout-height": "100px" }}>
          <SandpackCodeViewer code={codeBlock} />
        </SandpackLayout>
      </SandpackProvider>

      <br />

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
        theme={
          ["auto", "dark", "light"].includes(current)
            ? current
            : themes[current]
        }
      />
    </div>
  );
}
