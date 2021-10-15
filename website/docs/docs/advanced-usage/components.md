---
sidebar_position: 2
---

# Components

Several `Sandpack` prefixed components are available in the `sandpack-react` package. They can be used to build custom presets, as long as they render within the providers we talked about during the previous section.

Let's try to rebuild the `Sandpack` preset.

## SandpackLayout

Let's add a code editor and introduce the `SandpackLayout` component.

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

And now we have pretty much the same component as the preset, minus the prop
passing, which you can decide based on your specific needs.

:::info 
`SandpackLayout` gives you the left-right split between two components and
also breaks the columns when the component is under 700px wide, so you have
some responsiveness built-in. It also renders the theme provider for convenience.
:::

You can also bring other components in the mix: `SandpackCodeViewer`,
`SandpackTranspiledCode`, `FileTabs`, `Navigator` and so on.

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

You will notice that the theming applies to all components in the same way, as
the theme object is also distributed by the context.

Some of the components have configuration props that toggle subparts on/off or that configure behavior/look. All
of them comunicate with sandpack through the shared context.

## SandpackCodeEditor

## SandpackCodeViewer

## SandpackPreview

