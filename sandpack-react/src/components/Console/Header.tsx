import React from "react";

import { ConsoleIcon } from "../../icons";
import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

export const Header: React.FC = () => {
  return (
    <div
      className={classNames(
        css({
          borderBottom: "1px solid $colors$surface2",
          padding: "$space$3 $space$2",
        })
      )}
    >
      <p
        className={classNames(
          css({
            lineHeight: 1,
            margin: 0,
            color: "$colors$base",
            fontSize: "$font$size",

            display: "flex",
            alignItems: "center",

            gap: "$space$2",
          })
        )}
      >
        <ConsoleIcon />
        Console
      </p>
    </div>
  );
};
