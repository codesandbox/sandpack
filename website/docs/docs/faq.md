---
sidebar_position: 6
title: FAQ
---

# Frequently asked questions

#### What is Sandpack?

Sandpack is an open ecosystem of components and utilities that allow you to compile and run modern frameworks in the browser. You can either use one of our predefined `components` for embedding the *CodeSandbox* experience into your projects, or you can build your own version of `sandpack`, on top of our standard components and utilities.

#### How to load local or private dependencies?

Currently, Sandpack doesn’t have a way to consume private dependencies from any kind of registry service, because the bundler host is shared with all Sandpack consumers apps. However, you can pass local dependencies just like a regular file or using the external resource API:

```jsx
<Sandpack
  customSetup={{
    files: {
      "/App.js": APP_CODE,
      "/node_modules/fake-library/package.json": JSON.stringify({
        name: "fake-library",
        main: "./index.js",
      }),
      "/node_modules/fake-library/index.js": `module.exports = {
    hello: (name) => "Hello " + name
  }`,
    },
  }}
  template="react"
/>
```

#### Does Sandpack support NextJs or other server-side applications?

We can't currently support this in the Sandpack library, due to technical limitations. Supporting this in the future would likely require logins and a paid service tier.

#### How to highlight TypeScript errors in the editor?

Sandpack still doesn't officially support any kind of language server to provide a way to highlight errors in the `SandpackCodeEditor`. However, there is a discussion of how to make it work on [this topic](https://github.com/codesandbox/sandpack/discussions/237), with some examples and CodeMirror documentation references of how to implement it.

#### Why is the bundler hosted externally (iframe) and not a simple JavaScript module?

There are a few reasons for hosting the bundler like this, as opposed to having it exported as library code, read more [here](/advanced-usage/client#why).
