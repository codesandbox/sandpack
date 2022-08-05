/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { transformers } from "./transformers";
import type { TransformsTypes } from "./transformers";

const TRANSFORMED_TYPE_KEY = "@t";

export type Message =
  | null
  | string
  | number
  | undefined
  | Array<any>
  | Record<any, any>
  | Boolean
  | Symbol
  | {
      "@t": TransformsTypes;
      data: {
        name: string;
        body: string;
        proto: TransformsTypes;
      };
    };

const format = (message: Message): any => {
  if (
    typeof message === "string" ||
    typeof message === "number" ||
    message === null
  ) {
    return message;
  } else if (Array.isArray(message)) {
    return message.map(format);
  } else if (typeof message == "object" && TRANSFORMED_TYPE_KEY in message) {
    const type = message[TRANSFORMED_TYPE_KEY] as TransformsTypes;
    const transform = transformers[type];

    return transform(message.data);
  }

  return message;
};

export const formatMessage = (message: Message): string | number => {
  console.log(message);
  const output = format(message);

  if (Array.isArray(output)) {
    const mergeArray = output.reduce<string>((acc, curr, index) => {
      return `${acc}${index ? ", " : ""}${formatMessage(curr)}`;
    }, "");

    return `[${mergeArray}]`;
  }

  switch (typeof output) {
    case "string":
      return `"${output}"`;

    case "number":
    case "function":
    case "symbol":
      return output.toString();

    case "undefined":
      return "undefined";

    case "object":
    default:
      if (output instanceof RegExp || output instanceof Error) {
        return output.toString();
      }

      return JSON.stringify(output);
  }
};
