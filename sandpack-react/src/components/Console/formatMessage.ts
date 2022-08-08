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
  } else if (typeof message === "object") {
    return Object.entries(message).reduce<Message>(
      (acc, [key, value]: [string, Message]) => {
        acc[key] = format(value);

        return acc;
      },
      {}
    );
  }

  return message;
};

export const formatMessage = (message: Message): string | number => {
  let input = message;
  if (typeof message === "object" && message?.constructor.name === "NodeList") {
    input = [];

    // TODO: support object with constructor name
    Object.keys(message).forEach((item) => {
      if (!isNaN(item)) {
        input.push(message[item]);
      }
    });
  }

  const output = format(input);

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

    case "boolean":
      return String(output);

    case "undefined":
      return "undefined";

    case "object":
    default:
      if (
        output instanceof RegExp ||
        output instanceof Error ||
        output instanceof Date
      ) {
        return output.toString();
      }

      if (output === null) {
        return String(null);
      }

      if (output instanceof HTMLElement) {
        return output.outerHTML;
      }

      // if (Object.entries(output).length === 0) {
      //   return output;
      // }

      // const formattedObject = Object.entries(output).reduce<Message>(
      //   (acc, [key, value]: [string, Message]) => {
      //     acc[key] = formatMessage(value);

      //     return acc;
      //   },
      //   {}
      // );

      // console.log(formattedObject);

      return JSON.stringify(output);
  }
};
