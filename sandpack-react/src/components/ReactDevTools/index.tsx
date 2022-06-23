import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackTheme } from "../..";
import { useSandpack } from "../../hooks/useSandpack";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
import { generateRandomId, isDarkColor } from "../../utils/stringUtils";

const devToolClassName = css({
  height: "$layout$height",
  width: "100%",
});

type DevToolsTheme = "dark" | "light";

/**
 * @category Components
 */
export const SandpackReactDevTools = ({
  clientId,
  theme,
  className,
  ...props
}: {
  clientId?: string;
  theme?: DevToolsTheme;
} & React.HTMLAttributes<HTMLDivElement>): JSX.Element | null => {
  const { listen, sandpack } = useSandpack();
  const { theme: sandpackTheme } = useSandpackTheme();
  const c = useClasser(THEME_PREFIX);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reactDevtools = React.useRef<any>();
  const generatedClientId = React.useRef<string>(generateRandomId());

  const [ReactDevTools, setDevTools] = React.useState<React.FunctionComponent<{
    browserTheme: DevToolsTheme;
  }> | null>(null);

  React.useEffect(() => {
    import("react-devtools-inline/frontend").then((module) => {
      reactDevtools.current = module;
    });
  }, []);

  const resolvedClientId = clientId
    ? clientId
    : Object.keys(sandpack.clients)?.[0] ?? generatedClientId.current;

  React.useEffect(() => {
    const unsubscribe = listen((msg) => {
      if (msg.type === "activate-react-devtools") {
        const client = sandpack.clients[resolvedClientId];
        const contentWindow = client?.iframe?.contentWindow;

        if (reactDevtools.current && contentWindow) {
          setDevTools(reactDevtools.current.initialize(contentWindow));
        }
      }
    }, resolvedClientId);

    return unsubscribe;
  }, [reactDevtools, resolvedClientId, listen, sandpack.clients]);

  React.useEffect(() => {
    sandpack.registerReactDevTools("legacy");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ReactDevTools) return null;

  const getBrowserTheme = (): DevToolsTheme => {
    if (theme) return theme;

    const isDarkTheme = isDarkColor(sandpackTheme.colors.surface1);

    return isDarkTheme ? "dark" : "light";
  };

  return (
    <div
      className={classNames(c("devtools"), devToolClassName, className)}
      {...props}
    >
      <ReactDevTools browserTheme={getBrowserTheme()} />
    </div>
  );
};
