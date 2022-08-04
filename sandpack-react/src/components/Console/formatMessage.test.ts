import type { Message } from "./formatMessage";
import { formatMessage } from "./formatMessage";

const cases: Array<[Message, string]> = [
  [{ data: {} }, '{"data":{}}'],
  [[], "[]"],

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
