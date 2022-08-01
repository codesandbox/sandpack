import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { SandpackStack } from "../../common";
import { RefreshIcon } from "../../icons";
import { CodeEditor } from "../CodeEditor";

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
  showHeader,
  maxMessageCount,
  ...props
}) => {
  const logs = useSandpackConsole({ clientId, maxMessageCount });

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const c = useClasser("sp");

  React.useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <SandpackStack>
      <div ref={wrapperRef} className={c("console-scroll")}>
        {logs.map(({ data, id, method }) => {
          return (
            <p
              key={id}
              className={c("console-item", `console-${getType(method)}`)}
            >
              <span />
              <span className={c("console-message")}>
                {data.map((msg, index) => {
                  if (typeof msg === "string") {
                    return <span key={`${msg}-${index}`}>{msg}</span>;
                  }

                  const children = JSON.stringify(msg);

                  return (
                    <span key={`${msg}-${index}`} className={c("console-span")}>
                      <CodeEditor
                        code={children}
                        fileType="js"
                        initMode="user-visible"
                        readOnly
                      />
                    </span>
                  );
                })}
              </span>
            </p>
          );
        })}
      </div>

      {showClearButton && (
        <button
          className={c("console-clean")}
          onClick={(): void => setLogs([])}
        >
          <RefreshIcon />
        </button>
      )}
    </SandpackStack>
  );
};
