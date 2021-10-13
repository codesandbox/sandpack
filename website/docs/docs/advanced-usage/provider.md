---
sidebar_position: 1
---

# Getting Deeper

If you open a preset file from the sandpack repository, you'll see it is made up
of smaller sandpack **components** and has limited logic for passing props to
those smaller components.

If you need a more custom solution, you can opt in to use these smaller
components that we export from the main package.

## Sandpack Provider

It all starts with the `SandpackProvider`, which is the central point of our
architecture. The provider abstracts the functionality of `sandpack` and places
the relevant state values and functions on a `context` object. The `React`
components that are exported by the main package (eg: SandpackCodeEditor,
SandpackPreview) use that `context` object to communicate with `sandpack`.

The `SandpackProvider` has the same style of parameters for the input:
`template` and `customSetup`. Additionally you can pass options for the bundler
and execution mode. So even if you run this basic snippet above, you will see a
default vanilla template preview, because the sandpack logic is running behind
the scenes through the context object.

## Theme Provider

However, you will notice that the buttons on the Preview look off. This is
because there is no root node to set the styling and the theme variables.

You can fix that with the `SandpackThemeProvider`:

```jsx
import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

const CustomSandpack = () => (
  <SandpackProvider>
    <SandpackThemeProvider>
      <SandpackPreview />
    </SandpackThemeProvider>
  </SandpackProvider>
);
```

The theme provider component will also render a wrapper div around your sandpack
components. That div ensures the theme variables and styling is specific to this
instance of sandpack.