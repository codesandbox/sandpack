import Ansi from "ansi-to-react";
import * as React from "react";

import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

export const StdoutList: React.FC<{
  data: Array<{ data: string; id: string }>;
}> = ({ data }) => {
  return (
    <>
      {data.map(({ data, id }) => {
        return (
          <div key={id} className={classNames(consoleItemClassName)}>
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
