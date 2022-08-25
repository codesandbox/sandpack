import * as React from "react";

import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

import { RunButton } from "./RunButton";
import { Toggle } from "./Toggle";

import type { Status } from "./";

const containerClassName = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid $colors$surface2",
  height: "40px",
  padding: "16px 8px",
  fontFamily: "Consolas, Monaco, monospace",
});

const buttonContainerClassName = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const marginRight = css({
  marginRight: "16px",
});

interface Props {
  runAllTests: () => void;
  runSpec: () => void;
  setVerbose: () => void;
  verbose: boolean;
  status: Status;
  isSpecOpen: boolean;
}

export const Controls: React.FC<Props> = ({
  runAllTests,
  runSpec,
  status,
  setVerbose,
  verbose,
  isSpecOpen,
}) => {
  return (
    <div className={classNames(containerClassName)}>
      <div className={classNames(buttonContainerClassName)}>
        <div className={classNames(marginRight)}>
          <RunButton disabled={status === "initialising"} onClick={runAllTests}>
            Run all
          </RunButton>
        </div>
        {isSpecOpen && (
          <RunButton disabled={status === "initialising"} onClick={runSpec}>
            Run suite
          </RunButton>
        )}
      </div>

      <Toggle
        checked={verbose}
        disabled={status === "initialising"}
        id="verbose"
        onChange={setVerbose}
      >
        Verbose
      </Toggle>
    </div>
  );
};
