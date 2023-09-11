/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  TRANSFORMED_TYPE_KEY,
  TRANSFORMED_TYPE_KEY_ALTERNATE,
  MAX_NEST_LEVEL,
  MAX_KEYS,
  MAX_LENGTH_STRING,
  CIRCULAR_REF_KEY,
} from "./constraints";
import { transformers } from "./transformers";
import type { TransformsTypes } from "./transformers";

export type Message =
  | null
  | string
  | number
  | undefined
  | Array<any>
  | Record<any, any>
  | Boolean
  | Symbol
  | { "@r": number }
  | {
      "@t": TransformsTypes;
      data: {
        name: string;
        body: string;
        proto: TransformsTypes;
      };
    };

const formatSymbols = (message: Message): any => {
  if (
    typeof message === "string" ||
    typeof message === "number" ||
    message === null
  ) {
    return message;
  } else if (Array.isArray(message)) {
    return message.map(formatSymbols);
  } else if (typeof message == "object" && TRANSFORMED_TYPE_KEY in message) {
    const type = message[TRANSFORMED_TYPE_KEY] as TransformsTypes;
    const transform = transformers[type];

    return transform(message.data);
  } else if (
    typeof message == "object" &&
    TRANSFORMED_TYPE_KEY_ALTERNATE in message
  ) {
    const type = message[TRANSFORMED_TYPE_KEY_ALTERNATE] as TransformsTypes;
    const transform = transformers[type];

    return transform(message.data);
  } else if (
    typeof message == "object" &&
    message.constructor?.name === "NodeList"
  ) {
    const NodeList = {};
    Object.entries(message).forEach(([key, value]) => {
      // @ts-ignore
      NodeList[key] = formatSymbols(value);
    });

    return NodeList;
  }

  return message;
};

const arrayToString = (
  output: Array<any>,
  references: Array<Message>,
  level: number
) => {
  const mergeArray = output.reduce<string>((acc, curr, index) => {
    return `${acc}${index ? ", " : ""}${fromConsoleToString(
      curr,
      references,
      level
    )}`;
  }, "");

  return `[${mergeArray}]`;
};

const objectToString = (
  output: Record<string, Message>,
  references: Array<Message>,
  level: number
) => {
  const constructorName =
    output.constructor.name !== "Object" ? `${output.constructor.name} ` : "";

  if (level > MAX_NEST_LEVEL) {
    return constructorName;
  }

  const entries = Object.entries(output);
  const formattedObject = Object.entries(output).reduce<string>(
    (acc, [key, value]: [string, Message], index: number) => {
      const comma = index === 0 ? "" : ", ";
      const breakLine = entries.length > 10 ? "\n  " : "";
      const formatted = fromConsoleToString(value, references, level);

      if (index === MAX_KEYS) {
        return acc + breakLine + "...";
      } else if (index > MAX_KEYS) {
        return acc;
      }

      return acc + `${comma}${breakLine}${key}: ` + formatted;
    },
    ""
  );

  return `${constructorName}{ ${formattedObject}${
    entries.length > 10 ? "\n" : " "
  }}`;
};

export const fromConsoleToString = (
  message: Message,
  references: Array<Message>,
  level = 0
): string => {
  try {
    const output = formatSymbols(message);

    if (Array.isArray(output)) {
      return arrayToString(output, references, level + 1);
    }

    switch (typeof output) {
      case "string":
        return `"${output}"`.slice(0, MAX_LENGTH_STRING);

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
          return output.outerHTML.slice(0, MAX_LENGTH_STRING);
        }

        if (Object.entries(output).length === 0) {
          return `{}`;
        }

        if (CIRCULAR_REF_KEY in output) {
          if (level > MAX_NEST_LEVEL) {
            return "Unable to print information";
          }

          const newMessage = references[output[CIRCULAR_REF_KEY]];

          return fromConsoleToString(newMessage, references, level + 1);
        }

        if (output.constructor?.name === "NodeList") {
          const length = output.length;
          const nodes = new Array(length).fill(null).map((_, index) => {
            return fromConsoleToString(output[index], references);
          });

          return `NodeList(${output.length})[${nodes}]`;
        }

        return objectToString(output, references, level + 1);
    }
  } catch {
    return "Unable to print information";
  }
};
