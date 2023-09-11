export const SYNTAX_ERROR_PATTERN = ["SyntaxError: ", "Error in sandbox:"];

export const CLEAR_LOG = {
  id: "random",
  method: "clear" as const,
  data: ["Console was cleared"],
};

export const TRANSFORMED_TYPE_KEY = "@t";
export const TRANSFORMED_TYPE_KEY_ALTERNATE = "#@t";
export const CIRCULAR_REF_KEY = "@r";

export const MAX_LENGTH_STRING = 10000;
export const MAX_NEST_LEVEL = 2;
export const MAX_KEYS = 400;
export const MAX_MESSAGE_COUNT = MAX_KEYS * 2;
