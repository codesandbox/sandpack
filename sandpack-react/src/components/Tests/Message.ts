type TestStatus = "idle" | "running" | "pass" | "fail";

export type TestError = Error & {
  matcherResult?: boolean;
  mappedErrors?: Array<{
    fileName: string;
    _originalFunctionName: string;
    _originalColumnNumber: number;
    _originalLineNumber: number;
    _originalScriptCode: Array<{
      lineNumber: number;
      content: string;
      highlight: boolean;
    }> | null;
  }>;
};

export interface Test {
  name: string;
  blocks: string[];
  status: TestStatus;
  path: string;
  errors: TestError[];
  duration?: number | undefined;
}

export type SandboxTestMessage =
  | ClearJestErrors
  | ({ type: "test" } & (
      | InitializedTestsMessage
      | TestCountMessage
      | TotalTestStartMessage
      | TotalTestEndMessage
      | AddFileMessage
      | RemoveFileMessage
      | FileErrorMessage
      | DescribeStartMessage
      | DescribeEndMessage
      | AddTestMessage
      | TestStartMessage
      | TestEndMessage
    ));

interface InitializedTestsMessage {
  event: messages.INITIALIZE;
}

interface ClearJestErrors {
  type: "action";
  action: "clear-errors";
  source: "jest";
  path: string;
}

interface TestCountMessage {
  event: "test_count";
  count: number;
}

interface TotalTestStartMessage {
  event: messages.TOTAL_TEST_START;
}

interface TotalTestEndMessage {
  event: messages.TOTAL_TEST_END;
}

interface AddFileMessage {
  event: messages.ADD_FILE;
  path: string;
}

interface RemoveFileMessage {
  event: messages.REMOVE_FILE;
  path: string;
}

interface FileErrorMessage {
  event: messages.FILE_ERROR;
  path: string;
  error: TestError;
}

interface DescribeStartMessage {
  event: messages.DESCRIBE_START;
  blockName: string;
}

interface DescribeEndMessage {
  event: messages.DESCRIBE_END;
}

interface AddTestMessage {
  event: messages.ADD_TEST;
  testName: string;
  path: string;
}

type TestMessage = Test & {
  blocks: string[];
  name: string;
  path: string;
};

interface TestStartMessage {
  event: messages.TEST_START;
  test: TestMessage;
}

interface TestEndMessage {
  event: messages.TEST_END;
  test: TestMessage;
}

enum messages {
  INITIALIZE = "initialize_tests",
  ADD_FILE = "add_file",
  REMOVE_FILE = "remove_file",
  FILE_ERROR = "file_error",
  TOTAL_TEST_START = "total_test_start",
  TOTAL_TEST_END = "total_test_end",
  TEST_START = "test_start",
  TEST_END = "test_end",
  DESCRIBE_START = "describe_start",
  DESCRIBE_END = "describe_end",
  ADD_TEST = "add_test",
}
