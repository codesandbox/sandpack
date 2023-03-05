/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment */
const POSITIONALS_EXP = /(%?)(%([sdjo]))/g;

function serializePositional(positional: any, flag: string): any {
  switch (flag) {
    // Strings.
    case "s":
      return positional;

    // Digits.
    case "d":
    case "i":
      return Number(positional);

    // JSON.
    case "j":
      return JSON.stringify(positional);

    // Objects.
    case "o": {
      // Preserve stings to prevent extra quotes around them.
      if (typeof positional === "string") {
        return positional;
      }

      const json = JSON.stringify(positional);

      // If the positional isn't serializable, return it as-is.
      if (json === "{}" || json === "[]" || /^\[object .+?\]$/.test(json)) {
        return positional;
      }

      return json;
    }
  }
}

function format(message: string, ...positionals: any[]): string {
  if (positionals.length === 0) {
    return message;
  }

  let positionalIndex = 0;
  let formattedMessage = message.replace(
    POSITIONALS_EXP,
    (match, isEscaped, _, flag) => {
      const positional = positionals[positionalIndex];
      const value = serializePositional(positional, flag);

      if (!isEscaped) {
        positionalIndex++;
        return value;
      }

      return match;
    }
  );

  // Append unresolved positionals to string as-is.
  if (positionalIndex < positionals.length) {
    formattedMessage += ` ${positionals.slice(positionalIndex).join(" ")}`;
  }

  formattedMessage = formattedMessage.replace(/%{2,2}/g, "%");

  return formattedMessage;
}

const STACK_FRAMES_TO_IGNORE = 2;

/**
 * Remove the "outvariant" package trace from the given error.
 * This scopes down the error stack to the relevant parts
 * when used in other applications.
 */
function cleanErrorStack(error: Error): void {
  if (!error.stack) {
    return;
  }

  const nextStack = error.stack.split("\n");
  nextStack.splice(1, STACK_FRAMES_TO_IGNORE);
  error.stack = nextStack.join("\n");
}

export class InvariantError extends Error {
  name = "Invariant Violation";

  constructor(public readonly message: string, ...positionals: any[]) {
    super(message);
    this.message = format(message, ...positionals);
    cleanErrorStack(this);
  }
}

export interface CustomErrorConstructor {
  new (message: string): Error;
}

export interface CustomErrorFactory {
  (message: string): Error;
}

export type CustomError = CustomErrorConstructor | CustomErrorFactory;

interface Invariant {
  (
    predicate: unknown,
    message: string,
    ...positionals: any[]
  ): asserts predicate;

  as(
    ErrorConstructor: CustomError,
    predicate: unknown,
    message: string,
    ...positionals: unknown[]
  ): asserts predicate;
}

export const invariant: Invariant = (
  predicate,
  message,
  ...positionals
): asserts predicate => {
  if (!predicate) {
    // @ts-ignore
    throw new InvariantError(message, ...positionals);
  }
};

invariant.as = (ErrorConstructor, predicate, message, ...positionals) => {
  if (!predicate) {
    const isConstructor = ErrorConstructor.prototype.name != null;

    const error: Error = isConstructor
      ? // @ts-ignore
        new ErrorConstructor(format(message, positionals))
      : // @ts-ignore
        ErrorConstructor(format(message, positionals));

    throw error;
  }
};
