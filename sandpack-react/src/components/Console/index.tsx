import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { getType, ConsoleData } from "./utils";
import { RefreshIcon } from "../../icons";
import { CodeEditor } from "../CodeEditor";

const MAX_MESSAGE_COUNT = 100;

export const SandpackConsole: React.FC<{ clientId?: string }> = ({
  clientId,
}) => {
  const { listen } = useSandpack();
  const [logs, setLogs] = React.useState<ConsoleData>([]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const c = useClasser("sp");

  React.useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === "console" && message.codesandbox) {
        console.log(message);
        setLogs((prev) => {
          const messages = [...prev, ...message.log];
          messages.slice(Math.max(0, messages.length - MAX_MESSAGE_COUNT));

          return messages;
        });
      }
    });

    return unsubscribe;
  }, [listen]);

  React.useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={c("console")}>
      <div className={c("console-scroll")} ref={wrapperRef}>
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
                    <span className={c("console-span")} key={`${msg}-${index}`}>
                      <CodeEditor
                        initMode="user-visible"
                        fileType="js"
                        code={children}
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

      <button className={c("console-clean")} onClick={() => setLogs([])}>
        <RefreshIcon />
      </button>
    </div>
  );
};
