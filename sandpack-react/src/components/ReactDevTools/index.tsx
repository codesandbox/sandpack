import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackTheme } from "../..";
import { useSandpack } from "../../hooks/useSandpack";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
import { isDarkColor } from "../../utils/stringUtils";

const devToolClassName = css({
  height: "$layout$height",
  width: "100%",
});

export const SandpackReactDevTools = ({
  clientId,
  ...props
}: {
  clientId?: string;
} & React.HtmlHTMLAttributes<unknown>): JSX.Element | null => {
  const { listen, sandpack } = useSandpack();
  const { theme } = useSandpackTheme();
  const c = useClasser(THEME_PREFIX);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ReactDevTools) return null;

  const isDarkTheme = isDarkColor(theme.colors.defaultBackground);

  return (
    <div className={classNames(c("devtools"), devToolClassName)} {...props}>
      <ReactDevTools browserTheme={isDarkTheme ? "dark" : "light"} />
    </div>
  );
};
