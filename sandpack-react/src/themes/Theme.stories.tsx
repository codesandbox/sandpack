import { storiesOf } from "@storybook/react";
import React from "react";
import { useState } from "react";

import { Sandpack } from "../";

import { SANDPACK_THEMES, defaultLight, defaultDark } from ".";

const stories = storiesOf("presets/Themes", module);

Object.keys(SANDPACK_THEMES).forEach((themeName) =>
  stories.add(themeName, () => (
    <Sandpack
      options={{
        showLineNumbers: true,
        showInlineErrors: true,
        showNavigator: true,
        showTabs: true,
      }}
      template="react"
      theme={themeName as keyof typeof SANDPACK_THEMES}
    />
  ))
);

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState("light");

  return (
    <div>
      <select onChange={(e) => setTheme(e.target.value)} value={theme}>
        <option value="light">light</option>
        <option value="dark">dark</option>
      </select>
      <Sandpack
        options={{
          showLineNumbers: true,
          showInlineErrors: true,
          showNavigator: true,
          showTabs: true,
        }}
        template="react"
        theme={theme === "light" ? defaultLight : defaultDark}
      />
    </div>
  );
};

stories.add("theme-switcher", () => <ThemeSwitcher />);
