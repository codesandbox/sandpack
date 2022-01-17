---
sidebar_position: 1
---

import {NestedSandpack} from "../../src/NestedSandpack";
import {Sandpack as DefaultSandpack} from "@codesandbox/sandpack-react";

# Install

Sandpack is ready to be used in your React project. The package is published on `npm` and you can install it with:

```bash
npm i @codesandbox/sandpack-react
```

or

```bash
yarn add @codesandbox/sandpack-react
```

The package contains multiple **components**, **utilities** and **typings** for diving into
the `sandpack` ecosystem.

All the components and the bundler are packed inside the `Sandpack` component, which is a named export of the package.
Additionally, there is a small **stylesheet** you need to import globally into your project.

```jsx
import { Sandpack } from "@codesandbox/sandpack-react";

/* JSX Usage */
<Sandpack template="react" />;
```

This should give you a nice code editor with some file tabs and a preview that runs in the browser.

<NestedSandpack />

:::success Congrats!
You have integrated the first Sandpack component into your project
:::
