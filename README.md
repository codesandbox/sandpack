# Sandpack

<img src="https://user-images.githubusercontent.com/4838076/143455636-1e118fa2-3c9d-48c0-898e-aa3f44a0ad66.gif" alt="Component toolkit for live running code editing experiences" />

Sandpack is a component toolkit for creating your own live running code editing experience powered by CodeSandbox.

[Learn more about Sandpack](https://sandpack.codesandbox.io/)

## Sandpack client

This is a small foundation package that sits on top of the bundler. It is
framework agnostic and facilitates the handshake between your context and the bundler iframe.

[Read more](https://sandpack.codesandbox.io/docs/advanced-usage/client)

## Sandpack React

React components that give you the power of editable sandboxes that run in the browser.

```jsx
import { Sandpack } from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";

<Sandpack template="react" />;
```

[Read more](https://sandpack.codesandbox.io/docs/advanced-usage/components)

## Documentation

You can find the Sandpack documentation on [https://sandpack.codesandbox.io/docs/](https://sandpack.codesandbox.io/docs).

Start with the [Sandpack introduction](https://sandpack.codesandbox.io/docs) page for a quick overview and you can kick the tyres as well.

The documentation is divided into following sections:

-   [Getting Started](https://sandpack.codesandbox.io/docs/getting-started/install)
-   [Advanced Guides](https://sandpack.codesandbox.io/docs/advanced-usage/provider)
-   [API reference](https://sandpack.codesandbox.io/docs/api/client)
-   [Releases](https://sandpack.codesandbox.io/docs/releases)
