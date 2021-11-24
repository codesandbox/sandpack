---
sidebar_position: 3
---

import { SandpackProvider, SandpackLayout, SandpackCodeEditor } from "@codesandbox/sandpack-react"

# Hooks

If you want to build a new component or you want to re-implement the code
editor, for example, you can still rely on the sandpack state and create your UI
from scratch.

The `sandpack-react` package exports a set of hooks, that give you access to the sandpack context in your own components.

## useSandpack

The main hook is called `useSandpack` and gives you the entire context object to play with.

:::note
Keep in mind that the `useSandpack` hook only works inside the `<SandpackProvider>`.
:::

Let's build a code viewer component that renders a standard `pre` tag:

```jsx
import { useSandpack } from "@codesandbox/sandpack-react";

const SimpleCodeViewer = () => {
  const { sandpack } = useSandpack();
  const { files, activePath } = sandpack;

  const code = files[activePath].code;
  return <pre>{code}</pre>;
};
```

The `sandpack` object is available in any component and exposes all the internal
state:

- the `files` including all the setup/template files
- the `activePath` / `openPaths` fields
- the `error` object, if any
- multiple functions for changing the state of sandpack: `updateCurrentFile`,
  `setActiveFile`, etc.

In the component above, you get the active code string by calling
`files[activePath].code`, so any change of state will trigger a re-render of the
component and an update of the code.

We can test this with the `CustomSandpack` we implemented at the previous step.

```jsx
<SandpackProvider template="react">
  <SandpackLayout>
    <SandpackCodeEditor />
    {/* This will render the pre on the right side of your sandpack component */}
    <SimpleCodeViewer />
  </SandpackLayout>
</SandpackProvider>
```

If you run this, you will notice that the `SimpleCodeViewer` is in sync with the state of the `SandpackCodeEditor`.

`useSandpack` also exports `dispatch` and `listen`, you can levarage these functions for communicating directly with the bundler. However, at this point, you'd have
understood all the different types of messages and payloads that are passed from
the sandpack manager to the iframe and back.

```jsx
import { useSandpack } from "@codesandbox/sandpack-react";

const CustomRefreshButton = () => {
  const { dispatch, listen } = useSandpack();

  const handleRefresh = () => {
    // listens for any message dispatched between sandpack and the bundler
    const stopListening = listen((message) => console.log(message));

    // sends the refresh message to the bundler, should be logged by the listener
    dispatch({ type: "refresh" });

    // unsubscribe
    stopListening();
  };

  return (
    <button type="button" onClick={handleRefresh}>
      Refresh
    </button>
  );
};
```

Plus, `useSandpack` exposes a bunch of methods that you can use to manage the current state of the Sandpack instance:

| Method          | Description                                         |
| --------------- | --------------------------------------------------- |
| `closeFile`     | Close the given path in the editor                  |
| `deleteFile`    | Delete the given path in the editor                 |
| `dispatch`      | Sends a message to the bundler                      |
| `listen`        | Listens for messages from the bundler               |
| `openFile`      | Open the given path in the editor                   |
| `resetAllFiles` | Reset all files for all paths to the original state |
| `resetFile`     | Reset the code for a given path                     |
| `setActiveFile` | Set a specific file as active in a given path       |
| `updateFile`    | Update the content of a file in a given path        |

## useSandpackNavigation

Some of the common functionalities of sandpack are also extracted into
specialized hooks. These all use `useSandpack` under the hood, but abstract away
the shape of the **state** object and the **dispatch/listen** functions.

The refresh button can be built with the `useSandpackNavigation` hook:

```jsx
import { useSandpackNavigation } from "@codesandbox/sandpack-react";

const CustomRefreshButton = () => {
  const { refresh } = useSandpackNavigation();
  return (
    <button type="button" onClick={() => refresh()}>
      Refresh Sandpack
    </button>
  );
};
```

## useCodeSandboxLink

Similarly, we can build a custom link that opens the sandpack files in a new tab
on https://codesandbox.io. Let's the use `useCodeSandboxLink` for that:

```jsx
import { useCodeSandboxLink } from "@codesandbox/sandpack-react";

const CustomOpenInCSB = () => {
  const url = useCodeSandboxLink();
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      Open in CodeSandbox
    </a>
  );
};
```

## useActiveCode

We implemented the `SandpackCodeEditor` on top of
[codemirror/next](https://codemirror.net/6/), but it is super easy to switch to
your favorite code editor. Let's connect the sandpack state to an instance of
[AceEditor](https://securingsincity.github.io/react-ace/). You can use the
`useActiveCode` hook, which gives you the `code` value and the `updateCode` callback.

```jsx
import { useActiveCode } from "@codesandbox/sandpack-react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-textmate";

const CustomAceEditor = () => {
  const { code, updateCode } = useActiveCode();

  return (
    <AceEditor
      mode="javascript"
      defaultValue={code}
      onChange={updateCode}
      fontSize={14}
      height="300px"
      width="100%"
    />
  );
};
```

Now, let's put all of these custom components together:

```jsx
export const CustomSandpack = () => (
  <SandpackProvider template="react">
    <CustomAceEditor />
    <SandpackPreview showRefreshButton={false} showOpenInCodeSandbox={false} />
    <CustomRefreshButton />
    <CustomOpenInCSB />
  </SandpackProvider>
);
```

It's not pretty, but with just a few lines of code, you can create a whole new
component that uses the power of sandpack, but has all the UI and functionality
you need for your specific use case.

:::success Congrats!
You can now build your own sandpack-aware components on top of the sandpack custom hooks. The final piece of the puzzle is to understand the `sandpack-client`, the framework agnostic library that we use to manage the access to the bundler.
:::
