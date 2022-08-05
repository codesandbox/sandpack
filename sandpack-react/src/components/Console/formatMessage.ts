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
  | string
  | number
  | {
      "@t": TransformsTypes;
      data: {
        name: string;
        body: string;
        proto: TransformsTypes;
      };
    }
  | Array<any>
  | Record<any, any>;

const format = (message: Message): any => {
  if (typeof message === "string" || typeof message === "number") {
    return message;
  } else if (Array.isArray(message)) {
    return message.map(format);
  } else if (message[TRANSFORMED_TYPE_KEY]) {
    const type = message[TRANSFORMED_TYPE_KEY] as TransformsTypes;
    const transform = transformers[type];

    return transform(message.data);
  }

  // TODO: object

  return message;
};

export const formatMessage = (message: Message): string | number => {
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
      return output;

    case "function":
      return output.toString();

    case "object":
    default:
      return JSON.stringify(output);
  }
};
