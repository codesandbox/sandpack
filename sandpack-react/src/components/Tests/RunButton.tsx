import * as React from "react";

import { RoundedButton } from "../common/RoundedButton";
import { RunIcon } from "../icons";

export const RunButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (
    <RoundedButton onClick={onClick} title="Run tests">
      <RunIcon />
    </RoundedButton>
  );
};
