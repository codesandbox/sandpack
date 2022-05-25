---
sidebar_position: 5
title: Server-Side Render
---

# Server-Side Render

The `getSandpackCssText` function, which is available in the main package, is responsible for getting the Sandpack CSS string and server-side render it. Furthermore, Sandpack uses [stitches/core](https://stitches.dev/) under the hood to generate and dedupe theme variation, ensuring a consistent and lightweight CSS output.

```jsx
import { getSandpackCssText } from "@codesandbox/sandpack-react";

const cssTextOutput = getSandpackCssText();
```

## How to use it

Here's some examples of how to use in some popular React frameworks.

:::note Reminder
For a better hydration strategy, we highly recommend adding an `id="sandpack"` to your style tag.
:::

### Next.js

```js
// examples/nextjs/pages/_document.tsx
import { getSandpackCssText } from "@codesandbox/sandpack-react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style
            dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
            id="sandpack"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

### Gatsby

```js
// examples/gatsby/gatsby-ssr.js
import * as React from "react";
import { getSandpackCssText } from "@codesandbox/sandpack-react";

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <style
      id="sandpack"
      dangerouslySetInnerHTML={{
        __html: getSandpackCssText(),
      }}
    />,
  ]);
};
```

### Examples

Still not clear, take a look at these [examples](https://github.com/codesandbox/sandpack/tree/main/examples).
