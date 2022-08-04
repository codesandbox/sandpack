/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { transformers } from "./transformers";

/* eslint-disable @typescript-eslint/array-type */
const TRANSFORMED_TYPE_KEY = "@t";

export type Message =
  | string
  | number
  | {
      "@t": "Function" | "Number";
      data: {
        name: string;
        body: string;
        proto: "Function" | "Number";
      };
    }
  | Array<any>
  | Record<any, any>;

const format = (message: Message): string | number | Array<Message> => {
  if (typeof message === "string" || typeof message === "number") {
    return message;
  } else if (Array.isArray(message)) {
    return message.map(format);
  } else if (message[TRANSFORMED_TYPE_KEY]) {
    const type = message["@t"];
    const transform = transformers[type];

    return transform.fromSerializable(message);
  }

  return JSON.stringify(message);
};

export const formatMessage = (message: Message): string => {
  const output = format(message);

  if (typeof output === "string") return output;

  // if (Array.isArray(output)) {
  //   const mergeArray = output.reduce<string>((acc, curr) => {
  //     return `${acc}, ${curr}`;
  //   }, "");

  //   return `[${mergeArray}]`;
  // }

  try {
    return Object.prototype.toString.call(output);
  } catch (err) {
    return "[" + typeof output + "]";
  }
};
