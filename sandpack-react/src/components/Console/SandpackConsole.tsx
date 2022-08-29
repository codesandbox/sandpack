import * as React from "react";

import { SandpackStack } from "../../common";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
import { CodeEditor } from "../CodeEditor";

import { Button } from "./Button";
import { Header } from "./Header";
import { useSandpackConsole } from "./useSandpackConsole";
import { fromConsoleToString } from "./utils/fromConsoleToString";
import type { SandpackConsoleData } from "./utils/getType";
import { getType } from "./utils/getType";

interface SandpackConsoleProps {
  clientId?: string;
  showHeader?: boolean;
  showSyntaxError?: boolean;
  maxMessageCount?: number;
  onLogsChange?: (logs: SandpackConsoleData) => void;
}

/**
 * @category Components
 *
 * `SandpackConsole` is a Sandpack devtool that allows printing
 * the console logs from a Sandpack client. It is designed to be
 * a light version of a browser console, which means that it's
 * limited to a set of common use cases you may encounter when coding.
 */
export const SandpackConsole: React.FC<
  React.HTMLAttributes<HTMLDivElement> & SandpackConsoleProps
> = ({
  clientId,
  showHeader = true,
  showSyntaxError = false,
  maxMessageCount,
  onLogsChange,
  className,
  ...props
}) => {
  const { logs, reset } = useSandpackConsole({
    clientId,
    maxMessageCount,
    showSyntaxError,
  });
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    onLogsChange?.(logs);

    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [onLogsChange, logs]);

  return (
    <SandpackStack
      className={classNames(
        css({ height: "100%", background: "$surface1" }),
        `${THEME_PREFIX}-console`,
        className
      )}
      {...props}
    >
      {showHeader && <Header />}
      <div
        ref={wrapperRef}
        className={classNames(
          css({ overflow: "auto", scrollBehavior: "smooth" })
        )}
      >
        {logs.map(({ data, id, method }, logIndex, references) => {
          if (!data) return null;

          if (Array.isArray(data)) {
            return (
              <React.Fragment key={id}>
                {data.map((msg, msgIndex) => {
                  const fixReferences = references.slice(
                    logIndex,
                    references.length
                  );

                  return (
                    <div
                      key={`${id}-${msgIndex}`}
                      className={classNames(
                        consoleItemClassName({ variant: getType(method) })
                      )}
                    >
                      <CodeEditor
                        code={
                          method === "clear"
                            ? (msg as string)
                            : fromConsoleToString(msg, fixReferences)
                        }
                        fileType="js"
                        initMode="user-visible"
                        showReadOnly={false}
                        readOnly
                        wrapContent
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            );
          }

          return null;
        })}
      </div>

      <Button onClick={reset} />
    </SandpackStack>
  );
};

const consoleItemClassName = css({
  width: "100%",
  padding: "$space$3 $space$2",
  fontSize: ".85em",
  position: "relative",

  "&:not(:first-child):after": {
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

        "&:not(:first-child):after": {
          background: "$colors$error",
          opacity: 0.07,
        },
      },
      warning: {
        color: "$colors$warning",
        background: "$colors$warningSurface",

        "&:not(:first-child):after": {
          background: "$colors$warning",
          opacity: 0.07,
        },
      },
      clear: {
        fontStyle: "italic",
      },
      info: {},
    },
  },
});
