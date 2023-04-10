import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { css } from "../../styles";
import { buttonClassName, iconClassName } from "../../styles/shared";
import { useClassNames } from "../../utils/classNames";
import { BackwardIcon, ForwardIcon, RefreshIcon } from "../icons";

import { splitUrl } from "./utils";

const navigatorClassName = css({
  display: "flex",
  alignItems: "center",
  height: "$layout$headerHeight",
  borderBottom: "1px solid $colors$surface2",
  padding: "$space$3 $space$2",
  background: "$colors$surface1",
});

const inputClassName = css({
  backgroundColor: "$colors$surface2",
  color: "$colors$clickable",
  padding: "$space$1 $space$3",
  borderRadius: "99999px",
  border: "1px solid $colors$surface2",
  height: "24px",
  lineHeight: "24px",
  fontSize: "inherit",
  outline: "none",
  flex: 1,
  marginLeft: "$space$4",
  width: "0",
  transition: "background $transitions$default",

  "&:hover": {
    backgroundColor: "$colors$surface3",
  },

  "&:focus": {
    backgroundColor: "$surface1",
    border: "1px solid $colors$accent",
    color: "$colors$base",
  },
});

export interface NavigatorProps {
  clientId: string;
  onURLChange?: (newURL: string) => void;
  startRoute?: string;
}

export const Navigator = ({
  clientId,
  onURLChange,
  className,
  startRoute,
  ...props
}: NavigatorProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
  const [baseUrl, setBaseUrl] = React.useState<string>("");
  const { sandpack, dispatch, listen } = useSandpack();

  const [relativeUrl, setRelativeUrl] = React.useState<string>(
    startRoute ?? sandpack.startRoute ?? "/"
  );

  const [backEnabled, setBackEnabled] = React.useState(false);
  const [forwardEnabled, setForwardEnabled] = React.useState(false);

  const classNames = useClassNames();

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
    }, clientId);

    return (): void => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const path = e.target.value.startsWith("/")
      ? e.target.value
      : `/${e.target.value}`;

    setRelativeUrl(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === "Enter") {
      //  Enter
      e.preventDefault();
      e.stopPropagation();

      if (typeof onURLChange === "function") {
        onURLChange(baseUrl + e.currentTarget.value);
      }
    }
  };

  const handleRefresh = (): void => {
    dispatch({ type: "refresh" });
  };

  const handleBack = (): void => {
    dispatch({ type: "urlback" });
  };

  const handleForward = (): void => {
    dispatch({ type: "urlforward" });
  };

  const buttonsClassNames = classNames("button", [
    classNames("icon"),
    buttonClassName,
    iconClassName,
    css({
      minWidth: "$space$6",
      justifyContent: "center",
    }),
  ]);

  return (
    <div
      className={classNames("navigator", [navigatorClassName, className])}
      {...props}
    >
      <button
        aria-label="Go back one page"
        className={buttonsClassNames}
        disabled={!backEnabled}
        onClick={handleBack}
        type="button"
      >
        <BackwardIcon />
      </button>
      <button
        aria-label="Go forward one page"
        className={buttonsClassNames}
        disabled={!forwardEnabled}
        onClick={handleForward}
        type="button"
      >
        <ForwardIcon />
      </button>
      <button
        aria-label="Refresh page"
        className={buttonsClassNames}
        onClick={handleRefresh}
        type="button"
      >
        <RefreshIcon />
      </button>

      <input
        aria-label="Current Sandpack URL"
        className={classNames("input", [inputClassName])}
        name="Current Sandpack URL"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        type="text"
        value={relativeUrl}
      />
    </div>
  );
};
