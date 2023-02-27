import React from "react";

import { css } from "../../styles";
import { buttonClassName, roundedButtonClassName } from "../../styles/shared";
import { useClassNames } from "../../utils/classNames";
import { ConsoleIcon } from "../icons";

const wrapperClassName = css({
  justifyContent: "space-between",
  borderBottom: "1px solid $colors$surface2",
  padding: "0 $space$2",
  fontFamily: "$font$mono",
  height: "$layout$headerHeight",
  minHeight: "$layout$headerHeight",
  overflowX: "auto",
  whiteSpace: "nowrap",
});

const flexClassName = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "$space$2",
});

export const Header: React.FC<{
  currentTab: "server" | "client";
  setCurrentTab: (value: "server" | "client") => void;
  node: boolean;
}> = ({ currentTab, setCurrentTab, node }) => {
  const classNames = useClassNames();

  const buttonsClassName = classNames("console-header-button", [
    buttonClassName,
    roundedButtonClassName,
    css({ padding: "$space$1 $space$3" }),
  ]);

  return (
    <div
      className={classNames("console-header", [
        wrapperClassName,
        flexClassName,
      ])}
    >
      <p
        className={classNames("console-header-title", [
          css({
            lineHeight: 1,
            margin: 0,
            color: "$colors$base",
            fontSize: "$font$size",

            display: "flex",
            alignItems: "center",

            gap: "$space$2",
          }),
        ])}
      >
        <ConsoleIcon />
        <span>Terminal</span>
      </p>

      {node && (
        <div className={classNames("console-header-actions", [flexClassName])}>
          <button
            className={buttonsClassName}
            data-active={currentTab === "server"}
            onClick={(): void => setCurrentTab("server")}
            type="button"
          >
            Server
          </button>

          <button
            className={buttonsClassName}
            data-active={currentTab === "client"}
            onClick={(): void => setCurrentTab("client")}
            type="button"
          >
            Client
          </button>
        </div>
      )}
    </div>
  );
};
