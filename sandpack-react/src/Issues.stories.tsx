/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { Sandpack } from "./";

export default {
  title: "Bug reports/Issues",
};

export const Issue454 = (): JSX.Element => {
  const [readOnly, setReadOnly] = useState(false);

  return (
    <>
      <button
        className="trigger"
        onClick={(): any => setReadOnly((prev) => !prev)}
      >
        click
      </button>
      <Sandpack options={{ readOnly }} />
    </>
  );
};
