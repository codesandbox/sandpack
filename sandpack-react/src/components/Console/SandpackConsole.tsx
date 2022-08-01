import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { SandpackStack } from "../../common";
import { css } from "../../styles";
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

  const c = useClasser("sp");

  React.useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <SandpackStack {...props}>
      {showHeader && <Header />}
      <div ref={wrapperRef} className={classNames(css({ overflow: "auto" }))}>
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
  variants: {
    variant: {
      error: {
        color: "$colors$error",
        background: "$colors$errorSurface",
      },
      warning: {
        color: "$colors$warning",
        background: "$colors$warningSurface",
      },
      info: {},
    },
  },
});
