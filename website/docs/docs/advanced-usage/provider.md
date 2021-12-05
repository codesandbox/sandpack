---
sidebar_position: 1
---

# Getting Deeper

If you [open a preset file](https://github.com/codesandbox/sandpack/blob/main/sandpack-react/src/presets/Sandpack.tsx) from the sandpack repository, you'll see it is made up
of smaller sandpack **components** and has limited logic for passing props to
those smaller components.

If you need a custom version of sandpack, you can opt in to use these smaller
components, which are also exported from the main package.

Before talking about the actual components, let's dive into how sandpack manages its internal state.

## Sandpack Provider

The core of sandpack is managed by the `SandpackProvider`, central point of our
architecture. The provider abstracts the functionality of `sandpack` and places
the public state values and functions on a `context` object. The `React`
components that are exported by the main package (eg: `SandpackCodeEditor`,
`SandpackPreview`) use that `context` object to communicate with `sandpack`.

:::info
The `SandpackProvider` accepts [the same two props](/getting-started/custom-content#template) for getting input as the `Sandpack` preset:
`template` and `customSetup`.
:::

`SandpackProvider` as well as the other sandpack components are named exports in the `sandpack-react` package.

```jsx
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";

const CustomSandpack = () => (
  <SandpackProvider>
    <SandpackPreview />
  </SandpackProvider>
);
```

Running this snippet will render a preview with a vanilla template, because the sandpack logic is running behind
the scenes and the template, if omitted, is `vanilla`.

However, you will notice that the buttons on the Preview look off. This is
because there is no styling applied to the sandpack components. For styling and theming, you need the `SandpackThemeProvider`.

### Clients

Under one Sandpack provider, you can have multiple `sandpack-clients`. For example, the most common case for multiple clients is when more than one SandpackPreview has been rendered.

To access all the clients or to pass messages to the iframes under the same provider, use the [`useSandpack`](/api/react/#usesandpack) hook, which gives a way to interact with these clients:

```js
const ListenerIframeMessage = () => {
  const { sandpack } = useSandpack();

  const sender = () => {
    Object.values(sandpack.clients).forEach((client) => {
      client.iframe.contentWindow.postMessage("Hello World", "*");
    });
  };

  return <button onClick={sender}>Send message</button>;
};
```

## Theme Provider

The `SandpackThemeProvider` is also exported from the main package. It needs to render inside the `SandpackProvider` and it needs to surround any component that requires styling from sandpack.

```jsx
import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";

const CustomSandpack = () => (
  <SandpackProvider>
    <SandpackThemeProvider>
      <SandpackPreview />
    </SandpackThemeProvider>
  </SandpackProvider>
);
```

:::info Reminder
Don't forget to import the css stylesheet if you want to use the styling of the standard sandpack components.
:::

The theme provider component will render a wrapper **div** around your sandpack
components. The div scopes the theme variables and styling to this
instance of sandpack, allowing you to style each instance independently.

:::success Congrats!
You took the first step in understanding the internals of sandpack. In the next section you will go through the common sandpack components and will learn how to build your custom sandpack-aware component.
