---
sidebar_position: 4
---

import { Sandpack } from "../../src/CustomSandpack";
import { NestedSandpack } from "../../src/NestedSandpack";
import { IntroCard } from "../../src/IntroCard"

# Themes

The overall style can be set through the `theme` prop. Once again, sandpack offers a set of predefined options, but you can also pass individual values to style your `Sandpack` instance.

<div class="intro-section">
  <IntroCard title="All themes" description="See all themes available on @codesandbox/sandpack-themes" href="/docs/api/themes" actionText="Access &#8594;" />

  <IntroCard title="Sandpack Theme Builder" description="Design and customize your own theme, among other Sandpack presets." href="https://sandpack.codesandbox.io/theme" actionText="Try it now" external />
</div>

## Standard Themes

Sandpack comes with some predefined themes:

<!-- prettier-ignore -->
<NestedSandpack nestedProps={`    // Try out the included themes below!
      theme="dark"
      // theme="light"
      // themes="auto"`}
/>

### All themes

Besides the included themes, you can also consume a set of themes from `@codesandbox/sandpack-themes`. You can find a list of all themes available on [@codesandbox/sandpack-themes](/docs/api/themes). To use a theme, you need to import it in your code:

```jsx
import { githubLightTheme } from "@codesandbox/sandpack-themes";

<Sandpack theme={githubLightTheme} />;
```

## Custom Theme

You can also pass a **partial** theme object that overrides properties in the
**default** theme, which is `light`.

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
