import {
  SandpackCodeViewer,
  SandpackProvider,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import * as themes from "@codesandbox/sandpack-themes";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState, useEffect } from "react";

import { LayoutList, LAYOUTS } from "./LayoutList";
import { TemplatesList } from "./TemplatesList";
import { ThemesList } from "./ThemesList";

export const Playground = () => {
  const { theme: pageTheme } = useTheme();
  const [template, setTemplate] = useState("nextjs");
  const [theme, setTheme] = useState("light");
  const [layout, setLayout] = useState("Default");

  useEffect(() => {
    setTemplate(window.localStorage["CSB_PLAYGROUND_TEMPLATE"] ?? "nextjs");
    setTheme(window.localStorage["CSB_PLAYGROUND_THEME"] ?? "light");
    setLayout(window.localStorage["CSB_PLAYGROUND_LAYOUT"] ?? "Default");
  }, []);

  useEffect(() => {
    if (template && theme && layout) {
      window.localStorage["CSB_PLAYGROUND_TEMPLATE"] = template;
      window.localStorage["CSB_PLAYGROUND_THEME"] = theme;
      window.localStorage["CSB_PLAYGROUND_LAYOUT"] = layout;
    }
  }, [template, theme, layout]);

  const getTheme = () => {
    if (pageTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? themes.sandpackDark
        : "light";
    }

    if (pageTheme === "dark") return themes.sandpackDark;

    return "light";
  };

  const predefinedThemes = ["auto", "dark", "light"].includes(theme);
  const themeCodeBlock = predefinedThemes
    ? ``
    : `
import { ${theme} } from "@codesandbox/sandpack-themes";`;

  const codeBlock = `import { Sandpack } from "@codesandbox/sandpack-react"${themeCodeBlock};

const App = () => {
  const files = {}
  
  return (
    ${LAYOUTS[layout].interface(`
      files={files} 
      ${predefinedThemes ? `theme="${theme}"` : `theme={${theme}}`} 
      template="${template}"`)}
  )  
}`;

  return (
    <>
      <h5 className="nx-font-semibold nx-tracking-tight nx-mt-8 nx-text-lg">
        2. Theme
      </h5>
      <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
        A theme is a set of visual styles and design elements that can be
        applied to your project, such as colors, fonts, and layout. This allows
        you to easily customize the look and feel of your project, without
        having to manually edit the CSS and HTML.{" "}
        <Link href="/getting-started/themes" target="_blank" passHref>
          <a className="nx-text-primary-500 nx-underline nx-decoration-from-font [text-underline-position:under]">
            More about custom themes {"->"}
          </a>
        </Link>
      </p>

      <ThemesList current={theme} setCurrent={setTheme} />

      <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
        <Link href="#preview" target="_blank" passHref>
          <a className="nx-text-primary-500 nx-underline nx-decoration-from-font [text-underline-position:under] nx-mr-2">
            See preview {"↓"}
          </a>
        </Link>
      </p>

      <br />
      <h5 className="nx-font-semibold nx-tracking-tight nx-mt-8 nx-text-lg">
        3. Template
      </h5>
      <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
        A template is a pre-defined structure for your project, which includes
        basic HTML, CSS, and JavaScript files. This allows you to quickly set up
        a project with a basic structure and styling, without having to start
        from scratch.{" "}
        <Link href="/getting-started/usage" target="_blank" passHref>
          <a className="nx-text-primary-500 nx-underline nx-decoration-from-font [text-underline-position:under]">
            More about files and templates {"->"}
          </a>
        </Link>
      </p>
      <TemplatesList current={template} setCurrent={setTemplate} />

      <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
        <Link href="#preview" target="_blank" passHref>
          <a className="nx-text-primary-500 nx-underline nx-decoration-from-font [text-underline-position:under] nx-mr-2">
            See preview {"↓"}
          </a>
        </Link>
      </p>

      <br />
      <h5 className="nx-font-semibold nx-tracking-tight nx-mt-8 nx-text-lg">
        4. Layout
      </h5>
      <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
        A layout refers to the arrangement of elements on the page, such as the
        positioning of text and images. This allows you to create a visually
        appealing and user-friendly design for your project, and can include
        elements such as grids and columns.{" "}
        <Link href="/advanced-usage/components" target="_blank" passHref>
          <a className="nx-text-primary-500 nx-underline nx-decoration-from-font [text-underline-position:under]">
            More about layout and components {"->"}
          </a>
        </Link>
      </p>
      <LayoutList current={layout} setCurrent={setLayout} list />

      <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
        <Link href="#preview" target="_blank" passHref>
          <a className="nx-text-primary-500 nx-underline nx-decoration-from-font [text-underline-position:under] nx-mr-2">
            See preview {"↓"}
          </a>
        </Link>
      </p>

      <h3
        className="nx-font-semibold nx-tracking-tight nx-mt-8 nx-text-2xl"
        id="preview"
      >
        Preview
      </h3>

      <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
        This is where you can see your component in action and test it in
        real-time. You can make changes to your code and see the results
        immediately.
      </p>

      <br />

      <div className="md:nx-sticky" style={{ bottom: "1em" }}>
        {LAYOUTS[layout].component({
          key: template + layout,
          template,
          theme: ["auto", "dark", "light"].includes(theme)
            ? theme
            : themes[theme],
        })}
      </div>

      <br />
      <h5 className="nx-font-semibold nx-tracking-tight nx-mt-8 nx-text-lg">
        Code snippet
      </h5>

      <br />
      <SandpackProvider theme={getTheme()}>
        <SandpackLayout className="nx-sandpack-fluid-layout">
          <SandpackCodeViewer code={codeBlock} />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};
