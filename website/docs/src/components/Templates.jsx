import {
  Sandpack,
  SandpackCodeViewer,
  SandpackProvider,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import { useTheme } from "next-themes";
import { useState } from "react";

import { TemplatesList } from "./TemplatesList";

export default function Templates() {
  const [current, setCurrent] = useState("react");
  const { theme } = useTheme();

  const getTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? sandpackDark
        : "light";
    }

    if (theme === "dark") return sandpackDark;

    return "light";
  };

  const codeBlock = `import { Sandpack } from "@codesandbox/sandpack-react"

<Sandpack template="${current}" />`;

  return (
    <div>
      <h3 className="nx-font-semibold nx-tracking-tight nx-mt-8 nx-text-2xl">
        Try it out:
      </h3>

      <TemplatesList current={current} setCurrent={setCurrent} />

      <br />

      <SandpackProvider theme={getTheme()}>
        <SandpackLayout className="nx-sandpack-fluid-layout">
          <SandpackCodeViewer code={codeBlock} />
        </SandpackLayout>
      </SandpackProvider>

      <br />

      <Sandpack template={current} theme={getTheme()} />
    </div>
  );
}
