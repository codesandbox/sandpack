/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { transformers } from "./transformers";
import type { TransformsTypes } from "./transformers";

const TRANSFORMED_TYPE_KEY = "@t";
const CIRCULAR_REF_KEY = "@r";
const MAX_LENGTH_STRING = 5000;

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
  }

  return message;
};

const arrayToString = (output: Array<any>, references: Array<Message>) => {
  const mergeArray = output.reduce<string>((acc, curr, index) => {
    return `${acc}${index ? ", " : ""}${fromConsoleToString(curr, references)}`;
  }, "");

  return `[${mergeArray}]`;
};

const objectToString = (
  output: Record<string, Message>,
  references: Array<Message>
) => {
  const formattedObject = Object.entries(output).reduce<string>(
    (acc, [key, value]: [string, Message], index: number) => {
      const comma = index === 0 ? "" : ", ";

      return acc + `${comma}${key}: ` + fromConsoleToString(value, references);
    },
    ""
  );

  const constructorName =
    output.constructor.name !== "Object" ? `${output.constructor.name} ` : "";

  return `${constructorName}{ ${formattedObject} }`;
};

export const fromConsoleToString = (
  message: Message,
  references: Array<Message>
): string => {
  try {
    // Handle circular reference
    if (
      typeof message === "object" &&
      message !== null &&
      CIRCULAR_REF_KEY in message
    ) {
      const newMessage = references[message[CIRCULAR_REF_KEY]];

      console.log(message[CIRCULAR_REF_KEY]);

      return fromConsoleToString(newMessage, references);
    }

    const output = formatSymbols(message);

    if (Array.isArray(output)) {
      return arrayToString(output, references);
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

        if (Object.entries(output).length === 0) {
          return `{}`;
        }

        return objectToString(output, references);
    }
  } catch {
    return "Unable to print information";
  }
};
