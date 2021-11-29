import React, { useEffect, useState } from "react";
import * as reactDevtools from "react-devtools-inline/frontend";

import { SandpackCodeEditor, SandpackPreview } from "..";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackStack,
  useSandpackTheme,
} from "../../";
import { useSandpack } from "../../hooks/useSandpack";
import { isDarkColor } from "../../utils/stringUtils";

export default {
  title: "devtool/React",
};

function SandpackListener() {
  const [devtoolBackendHasLoaded, setDevtoolBackedHasLoad] = useState(false);
  const [ReactDevTools, setDevTools] = useState(null);
  const { listen, sandpack } = useSandpack();
  const { theme } = useSandpackTheme();

  const isDarkTheme = isDarkColor(theme.palette.defaultBackground);

  useEffect(() => {
    const unsubscribe = listen((msg) => {
      if (msg.type === "start") {
        setDevtoolBackedHasLoad(true);
      }
    });

    return unsubscribe;
  }, [listen]);

  const clients = Object.values(sandpack.clients);
  const contentWindow = clients?.[0]?.iframe?.contentWindow;

  useEffect(() => {
    if (devtoolBackendHasLoaded && contentWindow) {
      setDevTools(reactDevtools.initialize(contentWindow));
    }
  }, [contentWindow, devtoolBackendHasLoaded]);

  return (
    ReactDevTools && (
      <div style={{ height: 400 }}>
        <ReactDevTools browserTheme={isDarkTheme ? "dark" : "light"} />
      </div>
    )
  );
}

export const ReactDevTool: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackLayout theme="light">
      <SandpackListener />
      <SandpackStack>
        <SandpackPreview />
        <SandpackCodeEditor />
      </SandpackStack>
    </SandpackLayout>
  </SandpackProvider>
);
