/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from "react";

import { generateRandomId } from "../../utils/stringUtils";

export const useGeneratedId = (id?: string): string => {
  return typeof id === "string"
    ? id
    : // @ts-ignore
    "useId" in React && typeof React.useId === "function"
    ? // @ts-ignore
      React.useId()
    : React.useRef<string>(generateRandomId()).current;
};
