---
sidebar_position: 5
---

import { Sandpack } from "../../src/CustomSandpack";
import { NestedSandpack } from "../../src/NestedSandpack";


# Themes

The overall style can be set through the `theme` prop. Once again, sandpack offers a set of predefined options, but you can also pass individual values to style your `Sandpack` instance.

### Standard Themes

Sandpack comes with some predefined themes:

To see all the themes at a glance, use [this sandbox](https://codesandbox.io/s/sandpack-theme-yqsmj).

<!-- prettier-ignore -->
<NestedSandpack nestedProps={`    // Try out the included themes below!
      theme="dark"
      // theme="light"
      // themes="auto" 
/>

### Custom Theme

You can also pass a **partial** theme object that overrides properties in the
**default** theme, which is `codesandbox-light`.

<!-- prettier-ignore -->
<NestedSandpack nestedProps={`    theme={{
        colors: {
          accent: "rebeccapurple",
        },
        syntax: {
          tag: "#006400",
          string: "rgb(255, 165, 0)",
          plain: "tomato",
        },
      }}`}
  />

:::success Sandpack Theme Builder
You can design your own theme or customize any existing Sandpack theme presets. [Try it now! ↗](https://sandpack.codesandbox.io/theme)
:::

Furthermore you can import an existing theme object and use object composition to override specific fields.

<!-- prettier-ignore -->
<NestedSandpack 
  setupCode={`import { Sandpack, sandpackDark } from "@codesandbox/sandpack-react";`}
  nestedProps={`    theme={{
        ...sandpackDark,
        typography: {
          fontSize: "16px",
          bodyFont: "Arial",
        },
      }}`}
  />