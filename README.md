<img style="width:100%" src="https://user-images.githubusercontent.com/4838076/163777661-a44ec0a9-ee7c-483a-bdbb-7898ba665f68.gif" alt="Component toolkit for live running code editing experiences" />

# Sandpack

Sandpack is a component toolkit for creating your own live running code editing experience powered by CodeSandbox.

[Learn more about Sandpack](https://sandpack.codesandbox.io/) 

[![Edit in CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/github/codesandbox/sandpack)

## Sandpack Client

This is a small foundation package that sits on top of the bundler. It is
framework agnostic and facilitates the handshake between your context and the bundler iframe.

[Read more](https://sandpack.codesandbox.io/docs/advanced-usage/client)

## Sandpack React

React components that give you the power of editable sandboxes that run in the browser.

```jsx
import { Sandpack } from "@codesandbox/sandpack-react";

<Sandpack template="react" />;
```

[Read more](https://sandpack.codesandbox.io/docs/advanced-usage/components)

## Sandpack Themes

A list of themes to customize your Sandpack components.

```jsx
import { githubLight } from "@codesandbox/sandpack-themes";

<Sandpack theme={githubLight} />;
```

[Read more](https://sandpack.codesandbox.io/docs/getting-started/themes)
