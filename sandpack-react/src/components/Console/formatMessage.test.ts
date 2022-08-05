import type { Message } from "./formatMessage";
import { formatMessage } from "./formatMessage";

const cases: Array<[Message, string]> = [
  /**
   * Primitives
   */
  ["Lorem ipsum", '"Lorem ipsum"'],
  [123, "123"],
  [true, "true"],
  [{ data: {} }, '{"data":{}}'],
  [[], "[]"],
  [{ "@t": "[[undefined]]", data: "" }, "undefined"],
  [Symbol("foo"), "Symbol(foo)"],
  [null, "null"],

  /**
   * Function
   */
  [
    {
      "@t": "Function",
      data: { name: "", body: "", proto: "Function" },
    },
    "function () {}",
  ],
  [
    {
      "@t": "Function",
      data: { name: "myFunction", body: "", proto: "Function" },
    },
    "function myFunction() {}",
  ],
  [{ "@t": "[[Date]]", data: 1659720915173 }, '"2022-08-05T17:35:15.173Z"'],
  [{ "@t": "[[NaN]]", data: "" }, "NaN"],
  [{ "@t": "[[RegExp]]", data: { src: "\\/\\/", flags: "" } }, "/\\/\\//"],

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
      [
        123,
        "anotherFoo",
        {
          "@t": "Function",
          data: { name: "anotherFunction", body: "", proto: "Function" },
        },
      ],
    ],
    '[123, "foo", function myFunction() {}, [123, "anotherFoo", function anotherFunction() {}]]',
  ],
];

describe(formatMessage, () => {
  it("should format message", () => {
    cases.forEach(([input, output]) => {
      expect(formatMessage(input)).toBe(output);
    });
  });
});
