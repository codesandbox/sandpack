import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackTheme } from "../..";
import { useSandpack } from "../../hooks/useSandpack";
import { isDarkColor } from "../../utils/stringUtils";

export const SandpackReactDevTools = ({
  clientId,
  ...props
}: {
  clientId?: string;
} & React.HtmlHTMLAttributes<unknown>): JSX.Element | null => {
  const { listen, sandpack } = useSandpack();
  const { theme } = useSandpackTheme();
  const c = useClasser("sp");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reactDevtools = React.useRef<any>();

  const [ReactDevTools, setDevTools] = React.useState<React.FunctionComponent<{
    browserTheme: "dark" | "light";
  }> | null>(null);

  React.useEffect(() => {
    import("react-devtools-inline/frontend").then((module) => {
      reactDevtools.current = module;
    });
  }, []);

  React.useEffect(() => {
    const unsubscribe = listen((msg) => {
      if (msg.type === "activate-react-devtools") {
        const client = clientId
          ? sandpack.clients[clientId]
          : Object.values(sandpack.clients)[0];
        const contentWindow = client?.iframe?.contentWindow;

        if (reactDevtools.current && contentWindow) {
          setDevTools(reactDevtools.current.initialize(contentWindow));
        }
      }
    });

    return unsubscribe;
  }, [reactDevtools, clientId, listen, sandpack.clients]);

  React.useEffect(() => {
    sandpack.registerReactDevTools();
  }, []);

  if (!ReactDevTools) return null;

  const isDarkTheme = isDarkColor(theme.palette.defaultBackground);

  return (
    <div className={c("devtools")} {...props}>
      <ReactDevTools browserTheme={isDarkTheme ? "dark" : "light"} />
    </div>
  );
};
