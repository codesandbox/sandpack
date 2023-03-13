import {
  Sandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackConsole,
  SandpackTranspiledCode,
  SandpackReactContext,
  CodeEditor,
  SandpackStack,
} from "@codesandbox/sandpack-react";

import { SelectorList, SelectorListButton } from "./SelectorList";

export const LAYOUTS = {
  Default: {
    component: (props) => <Sandpack {...props} />,
    interface: (props) => `<Sandpack${props}
    />`,
  },

  Advanced: {
    component: (props) => (
      <Sandpack
        options={{
          showConsoleButton: true,
          showInlineErrors: true,
          showNavigator: true,
          showLineNumbers: true,
          showTabs: true,
          initMode: "immediate",
        }}
        {...props}
      />
    ),
    interface: (props) => `<Sandpack${props}
      options={{
        showConsoleButton: true,
        showInlineErrors: true,
        showNavigator: true,
        showLineNumbers: true,
        showTabs: true,
      }}
    />`,
  },

  "Custom height": {
    component: (props) => (
      <Sandpack options={{ editorHeight: "400px" }} {...props} />
    ),
    interface: (props) => `<Sandpack${props}
      options={{ editorHeight: "400px" }}
    />`,
  },

  Reverse: {
    interface: (props) => `<SandpackProvider${props}
    >
      <SandpackLayout>
        <SandpackPreview />
        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>`,
    component: (props) => (
      <SandpackProvider
        options={{ ...(props.options ?? {}), initMode: "immediate" }}
        {...props}
      >
        <SandpackLayout>
          <SandpackPreview />
          <SandpackCodeEditor />
        </SandpackLayout>
      </SandpackProvider>
    ),
  },

  "File explorer": {
    interface: (props) => `<SandpackProvider${props}
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor closableTabs showTabs />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>`,
    component: (props) => (
      <SandpackProvider
        options={{ ...(props.options ?? {}), initMode: "immediate" }}
        {...props}
      >
        <SandpackLayout>
          <SandpackFileExplorer />
          <SandpackCodeEditor closableTabs showTabs />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>
    ),
  },

  "Console (tab)": {
    component: (props) => (
      <Sandpack
        {...props}
        options={{
          showConsole: true,
          showConsoleButton: true,
          initMode: "immediate",
        }}
      />
    ),
    interface: (props) => `<Sandpack${props}
      options={{ showConsole: true, showConsoleButton: true }}
    />`,
  },

  "Console (component)": {
    interface: (props) => `<SandpackProvider${props}
    >
      <SandpackLayout>
        <SandpackCodeEditor />
        <SandpackPreview />
        <SandpackConsole />
      </SandpackLayout>
    </SandpackProvider>`,
    component: (props) => (
      <SandpackProvider
        options={{ ...(props.options ?? {}), initMode: "immediate" }}
        {...props}
      >
        <SandpackLayout>
          <SandpackCodeEditor />
          <SandpackPreview />
          <SandpackConsole />
        </SandpackLayout>
      </SandpackProvider>
    ),
  },

  "Editor + Console": {
    interface: (props) => `<Sandpack${props} 
      options={{ layout: "console" }}
    >`,
    component: (props) => (
      <Sandpack
        options={{
          ...(props.options ?? {}),
          initMode: "immediate",
          layout: "console",
        }}
        {...props}
      />
    ),
  },

  "Transpiled code": {
    interface: (props) => `<SandpackProvider${props}
    >
      <SandpackLayout>
        <SandpackCodeEditor />
        <SandpackTranspiledCode />
      </SandpackLayout>
    </SandpackProvider>`,
    component: (props) => (
      <SandpackProvider
        options={{ ...(props.options ?? {}), initMode: "immediate" }}
        {...props}
      >
        <SandpackLayout>
          <SandpackCodeEditor />
          <SandpackTranspiledCode />
        </SandpackLayout>
      </SandpackProvider>
    ),
  },

  "Multiple previews": {
    interface: (props) => `<SandpackProvider${props}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          style={{ minWidth: "100%" }}
          showLineNumbers
          showTabs
        />
        <SandpackPreview />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>`,
    component: (props) => (
      <SandpackProvider
        options={{ ...(props.options ?? {}), initMode: "immediate" }}
        {...props}
      >
        <SandpackLayout>
          <SandpackCodeEditor
            style={{ minWidth: "100%" }}
            showLineNumbers
            showTabs
          />
          <SandpackPreview />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>
    ),
  },

  "Multiple editors": {
    interface: (props) => `<SandpackProvider${props}
    >
      <SandpackReactContext>
        {({ files, updateFile }) => {
          const fileListValues = Object.values(files);
          const fileListKeys = Object.keys(files);

          return (
            <SandpackLayout>
              <SandpackStack style={{ padding: "10px 0" }}>
                <CodeEditor
                  code={fileListValues[0].code}
                  filePath={fileListKeys[0]}
                  onCodeUpdate={(newCode) =>
                    updateFile(fileListKeys[0], newCode)
                  }
                  showTabs
                />
              </SandpackStack>

              <SandpackStack style={{ padding: "10px 0" }}>
                <CodeEditor
                  code={fileListValues[1].code}
                  filePath={fileListKeys[1]}
                  onCodeUpdate={(newCode) =>
                    updateFile(fileListKeys[1], newCode)
                  }
                  showTabs
                />
              </SandpackStack>

              <SandpackPreview />
            </SandpackLayout>
          );
        }}
      </SandpackReactContext>
    </SandpackProvider>`,
    component: (props) => (
      <SandpackProvider
        options={{ ...(props.options ?? {}), initMode: "immediate" }}
        {...props}
      >
        <SandpackReactContext>
          {({ files, updateFile }) => {
            const fileListValues = Object.values(files);
            const fileListKeys = Object.keys(files);

            return (
              <SandpackLayout>
                <SandpackStack style={{ padding: "10px 0" }}>
                  <CodeEditor
                    code={fileListValues[0].code}
                    filePath={fileListKeys[0]}
                    onCodeUpdate={(newCode) =>
                      updateFile(fileListKeys[0], newCode)
                    }
                    showTabs
                  />
                </SandpackStack>

                <SandpackStack style={{ padding: "10px 0" }}>
                  <CodeEditor
                    code={fileListValues[1].code}
                    filePath={fileListKeys[1]}
                    onCodeUpdate={(newCode) =>
                      updateFile(fileListKeys[1], newCode)
                    }
                    showTabs
                  />
                </SandpackStack>

                <SandpackPreview />
              </SandpackLayout>
            );
          }}
        </SandpackReactContext>
      </SandpackProvider>
    ),
  },

  "Only preview": {
    interface: (props) => `<SandpackProvider${props}
    >
      <SandpackLayout>
        <SandpackPreview />
        <SandpackConsole />
      </SandpackLayout>
    </SandpackProvider>`,
    component: (props) => (
      <SandpackProvider
        options={{ ...(props.options ?? {}), initMode: "immediate" }}
        {...props}
      >
        <SandpackLayout>
          <SandpackPreview />
          <SandpackConsole />
        </SandpackLayout>
      </SandpackProvider>
    ),
  },
};

export const LayoutList = ({ current, setCurrent }) => {
  return (
    <SelectorList>
      {Object.keys(LAYOUTS).map((name) => (
        <SelectorListButton
          key={name}
          active={current === name}
          onClick={() => setCurrent(name)}
        >
          <span>{name}</span>
        </SelectorListButton>
      ))}
    </SelectorList>
  );
};
