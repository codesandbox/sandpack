---
sidebar_position: 6
title: FAQ
---

# Frequently asked questions

#### What is Sandpack?

Sandpack is an open ecosystem of components and utilities that allow you to compile and run modern frameworks in the browser. You can either use one of our predefined `components` for embedding the *CodeSandbox* experience into your projects, or you can build your own version of `sandpack`, on top of our standard components and utilities.

#### How to load private dependencies?

Read the following [guide](/guides/private-packages).

#### How to load local dependencies? 

Currently, Sandpack doesn’t have a way to consume local dependencies, because the bundler host is shared with all Sandpack consumers apps. However, you can pass local dependencies just like a regular file or using the external resource API:

```jsx
<Sandpack
  files={{
    "/App.js": APP_CODE,
    "/node_modules/fake-library/package.json": JSON.stringify({
      name: "fake-library",
      main: "./index.js",
    }),
    "/node_modules/fake-library/index.js": `module.exports = {
    hello: (name) => "Hello " + name
  }`,
  }}
  template="react"
/>
```

#### Does Sandpack support NextJs or other server-side applications?

You can run sandpack-react in a NextJs application but currently Sandpack doesn't support passing over a NextJs application into a sandpack as files, due to technical limitations (a server is required to run the project). Supporting this in the future would likely require logins and a paid service tier.

#### How to highlight TypeScript errors in the editor?

Sandpack still doesn't officially support any kind of language server to provide a way to highlight errors in the `SandpackCodeEditor`. However, there is a discussion of how to make it work on [this topic](https://github.com/codesandbox/sandpack/discussions/237), with some examples and CodeMirror documentation references of how to implement it.

#### Why is the bundler hosted externally (iframe) and not a simple JavaScript module?

There are a few reasons for hosting the bundler like this, as opposed to having it exported as library code, read more [here](/advanced-usage/client#why).

#### Sandpack License

Sandpack is licensed under the Apache License 2.0.

The Apache License 2.0 is in the permissive category, meaning that you can do (nearly) anything you want with the code, with very few exceptions. Also you must include the following in the copy of the code, whether you have modified it or not: the original copyright notice, copy of the license, statement of significant changes have been made(only if applicable), and copy of the notice file.

Under this license, you can

- Use Sandpack commercially: Companies can include the licensed code in proprietary software that they then sell to customers.
- Alter the code: You are permitted to make modifications to the original code.
- Distribute any copies or modifications of Sandpack: An individual or organization is allowed to copy and/or update Sandpack, then make that version available to others (even commercially).
- Sublicense the code: A company can distribute their reworked version of Sandpack under a stronger license.
- Use patent claims: Under the terms of the Apache License 2.0, contributors to the code explicitly grant patent rights to users.
- Place warranty: Users of Sandpack can place a warranty on the licensed software.
