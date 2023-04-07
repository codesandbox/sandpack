import * as React from "react";

import { css } from "../../styles";
import Ansi from "../../utils/ansi-to-react";
import { useClassNames } from "../../utils/classNames";

export const StdoutList: React.FC<{
  data: Array<{ data: string; id: string }>;
}> = ({ data }) => {
  const classNames = useClassNames();
  return (
    <>
      {data.map(({ data, id }) => {
        return (
          <div
            key={id}
            className={classNames("console-item", [consoleItemClassName])}
          >
            <Ansi>{data}</Ansi>
          </div>
        );
      })}
    </>
  );
};

const consoleItemClassName = css({
  width: "100%",
  padding: "$space$3 $space$2",
  fontSize: ".85em",
  position: "relative",
  whiteSpace: "pre",

  "&:not(:first-child):after": {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: "$colors$surface3",
  },
});
