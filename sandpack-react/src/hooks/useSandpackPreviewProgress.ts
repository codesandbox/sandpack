import type * as sandpackEnv from "@codesandbox/sandpack-environments";
import * as React from "react";

export const useSandpackPreviewProgress = ({
  preview,
}: {
  preview: sandpackEnv.SandpackPreview;
}) => {
  const [isReady, setIsReady] = React.useState(
    preview.status.current === "READY"
  );
  const [loadingMessage, setLoadingMessage] = React.useState<null | string>(
    null
  );

  React.useEffect(() => {
    if (isReady) {
      return;
    }

    // TODO: Implement timeout in the environment
    // let timer: NodeJS.Timer;

    return preview.onStatusChange((status) => {
      switch (status.current) {
        case "ERROR": {
          break;
        }
        case "LOADING": {
          break;
        }
        case "READY": {
          setLoadingMessage(null);
          setIsReady(true);
          break;
        }
      }
    });
    /*
    TODO: Implement this stuff in the environment
    const unsubscribe = listen((message) => {
      if (message.type === "start" && message.firstLoad) {
        setIsReady(false);
      }

      if (timeout) {
        timer = setTimeout(() => {
          setLoadingMessage(null);
        }, timeout);
      }

      if (message.type === "dependencies") {
        setLoadingMessage(() => {
          switch (message.data.state) {
            case "downloading_manifest":
              return "[1/3] Downloading manifest";

            case "downloaded_module":
              return `[2/3] Downloaded ${message.data.name} (${message.data.progress}/${message.data.total})`;

            case "starting":
              return "[3/3] Starting";
          }
        });
      } else if (message.type === "vm/progress") {
        setLoadingMessage(message.data);
      }

      if (message.type === "done" && message.compilatonError === false) {
        setLoadingMessage(null);
        setIsReady(true);
        clearTimeout(timer);
      }
    }, clientId);

    return (): void => {
      if (timer) {
        clearTimeout(timer);
      }
      unsubscribe();
    };
    */
  }, [preview, isReady]);

  return loadingMessage;
};
