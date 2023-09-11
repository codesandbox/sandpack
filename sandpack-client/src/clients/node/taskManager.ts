function isCommand(char: string) {
  return /[a-zA-Z.]/.test(char);
}

function isAlpha(char: string) {
  return /[a-zA-Z]/.test(char);
}

function isWhitespace(char: string) {
  return /\s/.test(char);
}

function isOperator(char: string) {
  return /[&|]/.test(char);
}

function isArgument(char: string) {
  return /-/.test(char);
}

function isString(char: string) {
  return /["']/.test(char);
}

function isEnvVar(char: string) {
  return isAlpha(char) && char === char.toUpperCase();
}

export enum TokenType {
  OR = "OR",
  AND = "AND",
  PIPE = "PIPE",
  Command = "Command",
  Argument = "Argument",
  String = "String",
  EnvVar = "EnvVar",
}

type Token =
  | { type: TokenType.OR | TokenType.AND | TokenType.PIPE }
  | {
      type: TokenType.Command | TokenType.Argument | TokenType.String;
      value?: string;
    }
  | {
      type: TokenType.EnvVar;
      value: Record<string, string>;
    };

const operators = new Map<string, Token>([
  ["&&", { type: TokenType.AND }],
  ["||", { type: TokenType.OR }],
  ["|", { type: TokenType.PIPE }],
  ["-", { type: TokenType.Argument }],
]);

export function tokenize(input: string): Token[] {
  let current = 0;
  const tokens = [];

  function parseCommand(): Token {
    let value = "";
    while (isCommand(input[current]) && current < input.length) {
      value += input[current];
      current++;
    }

    return { type: TokenType.Command, value };
  }

  function parseOperator(): Token {
    let value = "";
    while (isOperator(input[current]) && current < input.length) {
      value += input[current];
      current++;
    }

    return operators.get(value)!;
  }

  function parseArgument(): Token {
    let value = "";
    while (
      (isArgument(input[current]) || isAlpha(input[current])) &&
      current < input.length
    ) {
      value += input[current];
      current++;
    }

    return { type: TokenType.Argument, value };
  }

  function parseString(): Token {
    const openCloseQuote = input[current];

    let value = input[current];
    current++;

    while (input[current] !== openCloseQuote && current < input.length) {
      value += input[current];
      current++;
    }

    value += input[current];
    current++;

    return { type: TokenType.String, value };
  }

  function parseEnvVars(): Token {
    const value: Record<string, string> = {};

    const parseSingleEnv = () => {
      let key = "";
      let pair = "";

      while (input[current] !== "=" && current < input.length) {
        key += input[current];
        current++;
      }

      // Skip equal
      if (input[current] === "=") {
        current++;
      }

      while (input[current] !== " " && current < input.length) {
        pair += input[current];
        current++;
      }

      value[key] = pair;
    };

    while (isEnvVar(input[current]) && current < input.length) {
      parseSingleEnv();

      current++;
    }

    return { type: TokenType.EnvVar, value };
  }

  while (current < input.length) {
    const currentChar = input[current];

    if (isWhitespace(currentChar)) {
      current++;
      continue;
    }

    switch (true) {
      case isEnvVar(currentChar):
        tokens.push(parseEnvVars());
        break;

      case isCommand(currentChar):
        tokens.push(parseCommand());
        break;
      case isOperator(currentChar):
        tokens.push(parseOperator());
        break;
      case isArgument(currentChar):
        tokens.push(parseArgument());
        break;

      case isString(currentChar):
        tokens.push(parseString());
        break;

      default:
        throw new Error(`Unknown character: ${currentChar}`);
    }
  }

  return tokens;
}
