import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { SandpackStack } from "../../common";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
import { CodeEditor } from "../CodeEditor";

import { Button } from "./Button";
import { Header } from "./Header";
import { useSandpackConsole } from "./useSandpackConsole";
import { getType } from "./utils";

interface SandpackConsoleProps {
  clientId?: string;
  showHeader?: boolean;
  showClearButton?: boolean;
  maxMessageCount?: number;
}

export const SandpackConsole: React.FC<
  React.HTMLAttributes<HTMLDivElement> & SandpackConsoleProps
> = ({
  clientId,
  showClearButton = true,
  showHeader = true,
  maxMessageCount,
  ...props
}) => {
  const { logs, reset } = useSandpackConsole({ clientId, maxMessageCount });
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <SandpackStack {...props}>
      {showHeader && <Header />}
      <div
        ref={wrapperRef}
        className={classNames(
          css({ overflow: "auto", scrollBehavior: "smooth" })
        )}
      >
        {logs.map(({ data, id, method }) => {
          const variant = getType(method);

          return (
            <div key={id}>
              {data.map((msg, index) => {
                if (typeof msg === "string") {
                  return (
                    <div
                      key={`${msg}-${index}`}
                      className={classNames(consoleItemClassName({ variant }))}
                    >
                      {msg}
                    </div>
                  );
                }

                return (
                  <div
                    key={`${msg}-${index}`}
                    className={classNames(consoleItemClassName({ variant }))}
                  >
                    <CodeEditor
                      code={JSON.stringify(msg)}
                      fileType="js"
                      initMode="user-visible"
                      showReadOnly={false}
                      readOnly
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {showClearButton && <Button onClick={reset} />}
    </SandpackStack>
  );
};

const consoleItemClassName = css({
  width: "100%",
  padding: "$space$3 $space$2",
  fontSize: ".85em",
  position: "relative",

  "&:after": {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: "$colors$surface3",
  },

  /**
   * Editor reset
   */
  ".cm-editor": {
    background: "none",
  },

  ".cm-content": {
    padding: 0,
  },

  [`.${THEME_PREFIX}-pre-placeholder`]: {
    margin: "0 !important",
    fontSize: "1em",
  },

  variants: {
    variant: {
      error: {
        color: "$colors$error",
        background: "$colors$errorSurface",

        "&:after": {
          background: "$colors$error",
          opacity: 0.07,
        },
      },
      warning: {
        color: "$colors$warning",
        background: "$colors$warningSurface",

        "&:after": {
          background: "$colors$warning",
          opacity: 0.07,
        },
      },
      info: {},
    },
  },
});
