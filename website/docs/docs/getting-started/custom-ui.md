---
sidebar_position: 3
---

import { Sandpack } from "../../src/CustomSandpack";
import { NestedSandpack } from "../../src/NestedSandpack";

# Custom UI

In this next section, you can read about all the different options for customizing the UI of the sandpack components that render inside the `Sandpack` preset.

## Custom Styling

Theming controls the color palette and typography, but you can also append your own custom style to existing sandpack components.

For this, sandpack uses a small package called [`classer`](https://github.com/code-hike/codehike/blob/next/packages/mdx/src/classer/index.tsx). To customize existing components, you need to map your own classes to the internal sandpack classes.

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
    },
  }}
/>
```

:::info
This pattern is compatible with most modern styling systems, including Tailwind, styled-components and emotion.
:::

## Bare components and remove runtime styling

Sandpack-React relies on [stitchesjs/stitches](https://github.com/stitchesjs/stitches) to style its component, which is almost zero-runtime CSS-in-JS framework. However, if you want to get rid of any runtime script or create your own style on top of Sandpack components, we provide a way to return bare components, which will eliminate all Sandpack CSS style.

To do it, you need to pass `SANDPACK_BARE_COMPONENTS` environment variable as `true`, which will remove the Stitches dependency, its execution and return only the HTML of the components.

## Visual Options

Some of the internal components of sandpack can be configured via the `options` prop.

### Navigator

By default `Sandpack` will show a refresh button in the lower part of the preview. Using `showNavigator` you can toggle on a full browser navigator component with: `back`, `forward` and `refresh buttons` as well as an input for the URL.

<!-- prettier-ignore -->
<NestedSandpack
  nestedProps={`    template="react"
      options={{
        showNavigator: true,
      }}`}
/>

### Tabs

File tabs are shown if more than one file is open. But you can force tabs to always be shown/hidden with the `showTabs` prop.

On top of that, the `closableTabs` prop allows you to add a small close button for each tab, which removes it from the list.

<!-- prettier-ignore -->
<NestedSandpack
  nestedProps={`    options={{
        showTabs: true,
        closableTabs: true,
      }}`}
/>

### Editor Settings

There are a few different props for the code editor. `showLineNumbers` and `showInlineErrors` will toggle on/off some of the elements of the editor component. By default, line numbers are shown, but errors are not highlighted inline.

`wrapContent` can be used to avoid horizontal scroll inside the code block.

One useful configuration is the height of the component. We recommend **fixed
heights**, to avoid any layout shift while the bundler is running or as you type
in the editor or switch the tab. By default, the height is set to `300px`, but
you can adjust that with the `editorHeight` prop.

Finally, you can specify the distribution between the width of the editor and that of the preview. The `SandpackLayout` component arranges the two in a flex layout, distributing the space between the editor and the preview according to this prop. A value of 60 for the `editorWidthPercentage` will mean the `Preview` gets 40% of the space.

<!-- prettier-ignore -->
<NestedSandpack
  nestedProps={`    options={{
        showLineNumbers: false, // default - true
        showInlineErrors: true, // default - false
        wrapContent: true, // default - false
        editorHeight: 350, // default - 300
        editorWidthPercentage: 60, // default - 50
      }}`}
/>

### Autorun

By default, the bundling process will start as soon as the component is getting
closer to the viewport, or when the page loads, if the component is already in
the viewport. But you can allow users to trigger the process manually.

When a `sandpack` instance is not set on `autorun`, which is the default
setting, it will show a `Run` button that initializes the bundling process. This can be handy in situations in which you don't want multiple sandpack instances to run everytime the user loads the page.

<!-- prettier-ignore -->
<NestedSandpack
  nestedProps={`    template="react"
      options={{
        autorun: false
      }}`}
/>

### Recompile Mode

The `recompileMode` option also allows you configure what happens when the user starts typing in the code editor. The `immediate` mode will fire the change to the bundler as soon as it is received, while the `delayed` mode will debounce the bundler operation until the user starts typing. Optionally, you can set the delay for the debounce, which by default is `500ms`.

By default, the mode is set to `delayed` to ensures the bundler doesn't run on each keystroke. You can customize this
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

### Resizable panels

The `<Sandpack />` preset component has resizable columns and rows by default, allowing users to extend and shrink the component sizes. This makes it easier to play with the preview component and shows more code-editor content. However, this is an optional configuration, and you can easily disable it: 

```jsx
<Sandpack options={{ resizablePanels: false }} />
```

Other components (`SandpackProvider` for example) do not have this functionality and it must be implemented by the user.

---

:::success Congrats!
You now know how to customize the content and the UI of the sandpack presets. The next section takes you deeper into the ecosystem, exposing the smaller components, context providers and hooks at your disposal.
:::
