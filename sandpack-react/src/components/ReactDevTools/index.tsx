import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackTheme } from "../..";
import { useSandpack } from "../../hooks/useSandpack";
import { isDarkColor } from "../../utils/stringUtils";

type DevToolsTheme = "dark" | "light";

export const SandpackReactDevTools = ({
  clientId,
  theme,
  ...props
}: {
  clientId?: string;
  theme?: DevToolsTheme;
} & React.HtmlHTMLAttributes<unknown>): JSX.Element | null => {
  const { listen, sandpack } = useSandpack();
  const { theme: sandpackTheme } = useSandpackTheme();
  const c = useClasser("sp");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reactDevtools = React.useRef<any>();

  const [ReactDevTools, setDevTools] = React.useState<React.FunctionComponent<{
    browserTheme: DevToolsTheme;
  }> | null>(null);

  React.useEffect(() => {
    import("react-devtools-inline/frontend").then((module) => {
      reactDevtools.current = module;
    });
  }, []);

  React.useEffect(() => {
    let unsubscribeMessageListener: () => void | undefined;

    const unsubscribe = listen((msg) => {
      if (msg.type === "activate-react-devtools") {
        /**
         * Sandpack client
         */
        const uid = msg.uid;
        const client = clientId
          ? sandpack.clients[clientId]
          : Object.values(sandpack.clients)[0];
        const contentWindow = client?.iframe?.contentWindow;

        /**
         * react-devtools-inline
         */
        if (reactDevtools.current && contentWindow) {
          const wall = {
            listen(listener: (params: unknown) => void): void {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const listenerCallback = (event: MessageEvent<any>): void => {
                if (event.data.uid === uid) {
                  listener(event.data);
                }
              };

              window.addEventListener("message", listenerCallback);

              unsubscribeMessageListener = (): void => {
                window.removeEventListener("message", listenerCallback);
              };
            },
            send(event: unknown, payload: unknown): void {
              contentWindow.postMessage({ event, payload, uid }, "*");
            },
          };

          const { createBridge, createStore, initialize } =
            reactDevtools.current;

          const bridge = createBridge(contentWindow, wall);
          const store = createStore(bridge);
          const DevTools = initialize(contentWindow, { bridge, store });

          setDevTools(DevTools);
        }
      }
    });

    return (): void => {
      unsubscribeMessageListener();
      unsubscribe();
    };
  }, [reactDevtools, clientId, listen, sandpack.clients]);

  React.useEffect(() => {
    sandpack.registerReactDevTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ReactDevTools) return null;

  const getBrowserTheme = (): DevToolsTheme => {
    if (theme) return theme;

    const isDarkTheme = isDarkColor(sandpackTheme.palette.defaultBackground);

    return isDarkTheme ? "dark" : "light";
  };

  return (
    <div className={c("devtools")} {...props}>
      <ReactDevTools browserTheme={getBrowserTheme()} />
    </div>
  );
};
