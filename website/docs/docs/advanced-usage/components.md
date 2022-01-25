---
sidebar_position: 2
---

import { SandpackProvider, SandpackCodeEditor, SandpackCodeViewer, SandpackTranspiledCode, SandpackPreview, SandpackThemeProvider } from "@codesandbox/sandpack-react"
import { Sandpack, SandpackLayout } from "../../src/CustomSandpack"
import SandpackDecorators from "../../src/examples/Decorators"

# Components

Several `Sandpack` prefixed components are available in the `sandpack-react` package. They can be used to build custom presets, as long as they render within the providers we talked about during the previous section.

Let's try to rebuild the `Sandpack` preset, using the sandpack components available in the `sandpack-react` package.

## Layout

The first component inside the `Provider` is `SandpackLayout`. This component ensures the theming is applied and gives your sandpack instance the two column layout with the first child on the left and the second one on the right.

:::info
`SandpackLayout` gives you the left-right split between two components and
also breaks the columns when the component is under 700px wide, so you have
some responsiveness built-in. It also renders the theme provider for convenience.
:::

```jsx
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

const CustomSandpack = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);
```

<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackCodeEditor />
    <SandpackPreview />
  </SandpackLayout>
</SandpackProvider>

Further now we have pretty much the same component as the preset, minus the prop
passing, which you can decide based on your specific needs.

You can easily swap the two components inside the `SandpackLayout` to get a different instance of `Sandpack`.

```jsx
<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackPreview />
    <SandpackCodeEditor />
  </SandpackLayout>
</SandpackProvider>
```

<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackPreview />
    <SandpackCodeEditor />
  </SandpackLayout>
</SandpackProvider>

`SandpackLayout` accepts a `theme` prop, so you can pass in your [custom theme object or a predefined theme](/getting-started/custom-ui#theming).

:::note Reminder
If you do not want to use the `SandpackLayout` but still want to have style applied to the `sandpack` components according to the theme,
you need to wrap your components with the `SandpackThemeProvider`.
:::

## Preview

The `Preview` component is running the `sandpack` bundler, so without rendering a Preview component you will not have any bundling and evaluation of the code in `sandpack`. However, the `Preview` is smart enough to start even if it is mounted later in the page. This is how the `autorun=false` mode is working.

```jsx
<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackPreview />
  </SandpackLayout>
</SandpackProvider>
```

This will give you a component that looks approximately the same as the `SandpackRunner` preset.

There's nothing stopping you from rendering multiple previews in the same `Provider`. They will all be connected to the same state source, but they can for example point to different pages of the same application.

```jsx
<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackPreview />
    <SandpackPreview />
    <SandpackPreview />
    <SandpackPreview />
  </SandpackLayout>
</SandpackProvider>
```

<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackPreview />
    <SandpackPreview />
    <SandpackPreview />
    <SandpackPreview />
  </SandpackLayout>
</SandpackProvider>

## Code Editor

The `SandpackCodeEditor` component renders a wrapper over [`codemirror`](https://github.com/codemirror/codemirror.next), a lightweight code editor we use inside `sandpack`.

```jsx
<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackCodeEditor />
    <SandpackPreview />
  </SandpackLayout>
</SandpackProvider>
```

If you played with the `Sandpack` preset, you should be familiar already with the props that you can pass to the code editor component:

```jsx
<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackCodeEditor
      showTabs
      showLineNumbers={false}
      showInlineErrors
      wrapContent
      closableTabs
    />
    <SandpackPreview />
  </SandpackLayout>
</SandpackProvider>
```

<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackCodeEditor
      showTabs
      showLineNumbers={false}
      showInlineErrors
      wrapContent
      closableTabs
    />
    <SandpackPreview />
  </SandpackLayout>
</SandpackProvider>

### Extensions

Sandpack uses CodeMirror under the hood to provide a nice editor. You can extend the editor with any CodeMirror extensions, such as [`@codemirror/autocomplete`](https://www.npmjs.com/package/@codemirror/autocomplete).

```jsx
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";

<SandpackProvider template="react">
  <SandpackThemeProvider>
    <SandpackCodeEditor
      extensions={[autocompletion()]}
      extensionsKeymap={[completionKeymap]}
    />
  </SandpackThemeProvider>
</SandpackProvider>

<Sandpack
  options={{
    codeEditor: {
      extensions: [autocompletion()],
      extensionsKeymap: [completionKeymap],
    },
  }}
  template="react"
/>
```

## Code Viewer

For situations when you strictly want to show some code and run it in the browser, you can use the `SandpackCodeViewer` component. It looks similar to the code editor, but it renders a read-only version of `codemirror`, so users will not be able to edit the code.

```jsx
<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackCodeViewer />
    <SandpackPreview />
  </SandpackLayout>
</SandpackProvider>
```

<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackCodeViewer />
    <SandpackPreview />
  </SandpackLayout>
</SandpackProvider>

### CodeMirror decorations

This API provides a way to draw or style a piece of code in the editor content. You can implement it in the following ways:

- Entire line: add `className` or elements attributes to an entire line;
- Range: add `className` or elements attributes to a piece of content, given a `line`, `startColumn` and `endColumn`;

<SandpackDecorators />

## ReactDevTools

Sandpack also provides a component that adds React DevTools, allowing you to inspect the React component hierarchies in the iframe. This is useful for `props` debugging and understanding the component tree. Our `SandpackReactDevTools` component has the same functionality as the React DevTools browser extensions, but it only shows what is in your Sandpack instance.

<!-- prettier-ignore -->
<div className="nestedSandpack">
  <Sandpack
    theme="sandpack-dark"
    customSetup={{
      dependencies: { "@codesandbox/sandpack-react": "latest" },
    }}
    files={{
      "/App.js": `import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackReactDevTools,
} from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";\n
export default function CustomSandpack() {
  return (
    <SandpackProvider template="react">
      <SandpackLayout>
        <div style={{ display: "flex", width: "100%" }}>
          <SandpackPreview />
          <SandpackReactDevTools />
        </div>
      </SandpackLayout>
    </SandpackProvider>
  )
}`
    }}
    template="react"
  />
</div>

## OpenInCodeSandboxButton

You can build a custom button that creates a new sandbox from the sandpack files. It will include any edits made in the Sandpack editor, so it is a great way to persist your changes. The created sandbox will open on [CodeSandbox](https://codesandbox.io) in a new tab.

Let's use the `UnstyledOpenInCodeSandboxButton` as an example:

```jsx
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  UnstyledOpenInCodeSandboxButton,
} from "@codesandbox/sandpack-react";

const CustomSandpack = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackCodeEditor />
      <UnstyledOpenInCodeSandboxButton>
        Open in CodeSandbox
      </UnstyledOpenInCodeSandboxButton>
    </SandpackLayout>
  </SandpackProvider>
);
```

The `UnstyledOpenInCodeSandboxButton` is a basic component that does not carry any styles. If you want a ready-to-use component, use the `OpenInCodeSandboxButton` instead, which has the same functionality but includes the CodeSandbox logo.

## Other components

You can also bring other components in the mix: `SandpackTranspiledCode`, `FileTabs`, `FileExplorer`, `Navigator` and so on.

For example, you can create an editor instance that gives you the transpiled
code of your **active** component instead of the preview page:

```jsx
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackTranspiledCode,
} from "@codesandbox/sandpack-react";

const CustomSandpack = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackTranspiledCode />
    </SandpackLayout>
  </SandpackProvider>
);
```

<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackCodeEditor />
    <SandpackTranspiledCode />
  </SandpackLayout>
</SandpackProvider>

You will notice that the theming applies to all components in the same way, as
the theme object is also distributed by the theme context.

Some of the components have configuration props that toggle subparts on/off or that configure behavior/look. All
of them comunicate with sandpack through the shared context.

:::success Congrats!
You can now easily create a custom Sandpack component by reusing some of the building components of the library. The next step is to build your own sandpack components with the help of our custom hooks.
:::
