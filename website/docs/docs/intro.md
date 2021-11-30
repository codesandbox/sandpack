---
sidebar_position: 1
slug: /
---

import { NestedSandpack } from "../src/NestedSandpack"
import { IntroCard } from "../src/IntroCard"

# Introduction

React components that give you the power of editable sandboxes that run in the
browser. Powered by `Sandpack`, the online bundler used by
[CodeSandbox](https://codesandbox.io/).

Sandpack is an open ecosystem of components and utilities that allow you to
compile and run modern frameworks in the browser. You can either use one of our
predefined `components` for embedding the _CodeSandbox_ experience into your
projects, or you can build your own version of `sandpack`, on top of our
standard components and utilities. As you walk through this guide, you will get
deeper into our ecosystem.

### Getting Started

<div class="intro-section">
  <IntroCard title="Install" description="Learn how to add Sandpack to your projects and start coding in minutes." href="/getting-started/install" actionText="Access ->" />

  <IntroCard title="Advanced Usage" description="An overview of some Sandpack capabilities and how to extend its API." href="/advanced-usage/provider" actionText="Access ->" />

  <IntroCard title="API reference" description="A full listing and description of the public API exported by the libraries." href="/api/react/components/" actionText="Access ->" />

  <IntroCard title="Sandpack Theme Builder" description="Design and customize your own theme, among other Sandpack presets." href="https://sandpack.codesandbox.io/theme" actionText="Try it now" external />
</div>

### Live coding environment in minutes

```js sandpack
export default function App() {
  return (
    <div className="App">
      <h1>Hello Sandpack ✨</h1>
      <p>Start editing to see some magic happen!</p>
    </div>
  );
}
```
