/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

const formatFunction = ({
  data,
}: {
  "@t": "Function" | "Number";
  data: {
    name: string;
    body: string;
    proto: "Function" | "Number";
  };
}): string => {
  function mock() {}

  try {
    Object.defineProperty(mock, "body", {
      value: data.body,
      writable: false,
    });

    // @ts-ignore
    mock.constructor = { name: data.proto };

    return mock.toString().replace("mock", data.name);
  } catch (e) {
    return "undefined";
  }
};

const format = (message: Message): string | number | Array<Message> => {
  if (typeof message === "string" || typeof message === "number") {
    return message;
  }

  if (Array.isArray(message)) {
    return message.map(format);
  }

  if (message[TRANSFORMED_TYPE_KEY]) {
    const type = message["@t"];

    if (type === "Function") {
      return formatFunction(message);
    }

    return message[TRANSFORMED_TYPE_KEY];
  }

  let children;

  try {
    children = JSON.stringify(message);
  } catch (error) {
    try {
      children = Object.prototype.toString.call(message);
    } catch (err) {
      children = "[" + typeof message + "]";
    }
  }

  return children;
};

export const formatMessage = (message: Message): string => {
  const output = format(message);

  if (typeof output === "string") return output;

  if (Array.isArray(output)) {
    const mergeArray = output.reduce<string>((acc, curr) => {
      return `${acc}, ${curr}`;
    }, "");

    return `[${mergeArray}]`;
  }

  return JSON.stringify(output);
};
