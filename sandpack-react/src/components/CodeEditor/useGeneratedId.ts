/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from "react";

import { generateRandomId } from "../../utils/stringUtils";

export const useGeneratedId = (id?: string): string =>
  id ??
  // @ts-ignore
  typeof React.useId === "function"
    ? // @ts-ignore
      React.useId()
    : React.useRef<string>(generateRandomId()).current;
