import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { BackwardIcon, ForwardIcon, RefreshIcon } from "../../icons";

import { splitUrl } from "./utils";

export const Navigator: React.FC = () => {
  const [baseUrl, setBaseUrl] = React.useState<string>("");
  const { sandpack, dispatch, listen } = useSandpack();

  const [relativeUrl, setRelativeUrl] = React.useState<string>(
    sandpack.startRoute ?? "/"
  );

  const [backEnabled, setBackEnabled] = React.useState(false);
  const [forwardEnabled, setForwardEnabled] = React.useState(false);

  const c = useClasser("sp");

  React.useEffect(() => {
    const unsub = listen((message) => {
      if (message.type === "urlchange") {
        const { url, back, forward } = message;

        const [newBaseUrl, newRelativeUrl] = splitUrl(url);

        setBaseUrl(newBaseUrl);
        setRelativeUrl(newRelativeUrl);
        setBackEnabled(back);
        setForwardEnabled(forward);
      }
    });

    return () => unsub();
  }, []);

  const commitUrl = () => {
    // TODO handle per preview instance
    // if (!sandpack.iframeRef.current) {
    //   return;
    // }

    // const newUrl = baseUrl + relativeUrl;
    // sandpack.iframeRef.current.src = newUrl;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const path = e.target.value.startsWith("/")
      ? e.target.value
      : `/${e.target.value}`;

    setRelativeUrl(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      //  Enter
      e.preventDefault();
      e.stopPropagation();

      commitUrl();
    }
  };

  const handleRefresh = () => {
    dispatch({ type: "refresh" });
  };

  const handleBack = () => {
    dispatch({ type: "urlback" });
  };

  const handleForward = () => {
    dispatch({ type: "urlforward" });
  };

  return (
    <div className={c("navigator")}>
      <button
        aria-label="Go back one page"
        className={c("button", "icon")}
        disabled={!backEnabled}
        onClick={handleBack}
        type="button"
      >
        <BackwardIcon />
      </button>
      <button
        aria-label="Go forward one page"
        className={c("button", "icon")}
        disabled={!forwardEnabled}
        onClick={handleForward}
        type="button"
      >
        <ForwardIcon />
      </button>
      <button
        aria-label="Refresh page"
        className={c("button", "icon")}
        onClick={handleRefresh}
        type="button"
      >
        <RefreshIcon />
      </button>

      <input
        aria-label="Current Sandpack URL"
        className={c("input")}
        name="Current Sandpack URL"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        type="text"
        value={relativeUrl}
      />
    </div>
  );
};
