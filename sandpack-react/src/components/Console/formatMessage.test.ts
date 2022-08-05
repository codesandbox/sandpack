import type { Message } from "./formatMessage";
import { formatMessage } from "./formatMessage";

const cases: Array<[Message, string]> = [
  /**
   * Primitives
   */
  [{ data: {} }, '{"data":{}}'],
  [[], "[]"],

  /**
   * Function
   */
  [
    {
      "@t": "Function",
      data: {
        name: "",
        body: "",
        proto: "Function",
      },
    },
    "function () {}",
  ],
  [
    {
      "@t": "Function",
      data: {
        name: "myFunction",
        body: "",
        proto: "Function",
      },
    },
    "function myFunction() {}",
  ],

  /**
   * Mix
   */
  [
    [
      123,
      "foo",
      {
        "@t": "Function",
        data: { name: "myFunction", body: "", proto: "Function" },
      },
    ],
    '[123,"foo",function myFunction() {}]',
  ],
];

describe(formatMessage, () => {
  it("should format message", () => {
    cases.forEach(([input, output]) => {
      expect(formatMessage(input)).toBe(output);
    });
  });
});
