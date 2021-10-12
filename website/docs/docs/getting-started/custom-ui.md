---
sidebar_position: 4
---

import { Sandpack } from "@codesandbox/sandpack-react"

# Custom UI

In this next section, you can read about all the different options for customizing the UI of the sandpack components that render inside the `Sandpack` preset.

## Theming

The overall style can be set through the `theme` prop. Once again, sandpack offers a set of predefined options, but you can also pass individual values to style your `Sandpack` instance.

### Standard Themes

Sandpack comes with some predefined themes:

```jsx
<Sandpack theme="codesandbox-dark" />
<Sandpack theme="codesandbox-light" />
<Sandpack theme="github-light" />
<Sandpack theme="night-owl" />
<Sandpack theme="aqua-blue" />
<Sandpack theme="monokai-pro" />
```

You can compare all the themes [in this sandbox](https://codesandbox.io/s/sandpack-theme-yqsmj)

### Custom Theme

You can also pass a **partial** theme object that overrides properties in the
**default** theme, which is `codesandbox-light`

```jsx
<Sandpack
  theme={{
    palette: {
      accent: "rebeccapurple",
    },
    syntax: {
      tag: "darkgreen",
      string: "orange",
    },
  }}
/>
```

Your `Sandpack` instance should look like this:

<Sandpack
  theme={{
    palette: {
      accent: "rebeccapurple",
    },
    syntax: {
      tag: "darkgreen",
      string: "orange"
    },
  }}
/>

Or you can import an existing theme object and use object composition to override specific fields.

```jsx
import { Sandpack, codesandboxDarkTheme } from "@codesandbox/sandpack-react";

<Sandpack
  theme={{
    ...codesandboxDarkTheme,
    typography: {
      fontSize: "16px",
      bodyFont: "Arial",
    },
  }}
/>
```

## Custom Styling

Theming controls the color palette and typography, but you can also append your own custom style to existing sandpack components.

For this, sandpack uses a small package called [`classer`](https://github.com/code-hike/codehike/tree/next/packages/classer). To customize existing components, you need to map your own classes to the internal sandpack classes.

:::note 
While inspecting your Sandpack instance, notice that our components have classes prefixed with `sp-`.
:::

```jsx
<Sandpack
  theme={theme}
  template="react"
  options={{
    classes: {
      "sp-wrapper": "custom-wrapper",
      "sp-layout": "custom-layout",
      "sp-tab-button": "custom-tab",
    }
  }}
/>
```

:::info
This pattern is compatible with most modern styling systems, including Tailwind, styled-components and emotion.
:::

## Visual Options

By default, `Sandpack` will show the file tabs if more than one file is open and
will show a small refresh button on top of the `Preview`. But you can customize
some of the parts of the component via flags set on the `options` prop.

### Navigator

```jsx
<Sandpack
  options={{
    showNavigator: true, // this will show a top navigator bar instead of the refresh button
    showTabs: false, // you can toggle the tabs on/off manually
    showLineNumbers: true, // this is off by default, but you can show line numbers for the editor
    wrapContent: true, // also off by default, this wraps the code instead of creating horizontal overflow
    editorWidthPercentage: 60, // by default the split is 50/50 between the editor and the preview
  }}
/>
```

### Tabs

### Editor Settings

One useful configuration is the height of the component. We recommend **fixed
heights**, to avoid any layout shift while the bundler is running or as you type
in the editor or switch the tab. By default, the height is set to `300px`, but
you can adjust that with the `options.editorHeight` prop:

```jsx
<Sandpack
  options={{
    editorHeight: 350,
  }}
/>
```

Furthermore, we implemented our css classes with a handy utility package called
`classer`.

### Autorun

By default, the bundling process will start as soon as the component is getting
closer to the viewport, or when the page loads if the component is already in
the viewport. But you can allow users to trigger the process manually.

```jsx
<Sandpack options={{ autorun: false }} template="react" />
```

When a `sandpack` instance is not set on `autorun`, which is the default
setting, it will show a _Run_ button that initializes the process.

### Recompile Mode

The `options` also allow you to customize the _recompile mode_, or what happens
you type inside the code editor.

```jsx
<Sandpack options={{ recompileMode: "immediate" }} template="react" />
```

By default, the mode is set to `delayed` and there's a `500ms` debounce timeout
that ensures the bundler doesn't run on each keystroke. You can customize this
experience by modifying the `recompileDelay` value or by setting the
`recompileMode` to `immediate`.

```jsx
<Sandpack
  options={{
    recompileMode: "delayed",
    recompileDelay: 300,
  }}
  template="react"
/>
```

## Sandpack Runner

In all the examples above we used `Sandpack`, which, in our internal kitchen, we
call a preset. In other words, it is a fixed configuration of sandpack
components and default settings that make up an instance of _sandpack_.

In case you want to have the bundler running and you don't want the code editing
component, you can use a `SandpackRunner` preset.

The `SandpackRunner` has some of the props we already described above:
`template`, `customSetup` and `theme`. They work exactly the same on this
preset.

However, your input will be sent through the `code` prop. This is a single
string that will replace the **main** file of the project.

```jsx
import { SandpackRunner } from "@codesandbox/sandpack-react";

<SandpackRunner code={`...`} template="vue" />;
```

In this example, `code` will replace the `App.vue` file, because that is the
**main** file in the vue template. For `react`, this would be the `App.js` file.

:::success Congrats!
You now know how to customize the content and the UI of the sandpack presets. The next section takes you deeper into the ecosystem, exposing the smaller components, context providers and hooks at your disposal.
:::