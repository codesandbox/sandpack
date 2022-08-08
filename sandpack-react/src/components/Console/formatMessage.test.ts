import jsdom from "jsdom";

import type { Message } from "./formatMessage";
import { formatMessage } from "./formatMessage";

global.window = new jsdom.JSDOM().window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;

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
  [
    { "@t": "[[Date]]", data: 1659720915173 },
    "Fri Aug 05 2022 18:35:15 GMT+0100 (Western European Summer Time)",
  ],
  [{ "@t": "[[NaN]]", data: "" }, "NaN"],
  [{ "@t": "[[RegExp]]", data: { src: "\\/\\/", flags: "" } }, "/\\/\\//"],
  [
    {
      "@t": "HTMLElement",
      data: { tagName: "button", attributes: {}, innerHTML: "Click" },
    },
    "<button>Click</button>",
  ],
  [
    [
      {
        "@t": "HTMLElement",
        data: { tagName: "button", attributes: {}, innerHTML: "string" },
      },
      {
        "@t": "HTMLElement",
        data: { tagName: "button", attributes: {}, innerHTML: "number" },
      },
      {
        "@t": "HTMLElement",
        data: { tagName: "button", attributes: {}, innerHTML: "boolean" },
      },
    ],
    "[<button>string</button>, <button>number</button>, <button>boolean</button>]",
  ],

  /**
   * Mix
   */
  [
    {
      foo: [{ "@t": "[[Date]]", data: 1659975293702 }],
      baz: {
        "@t": "Function",
        data: { name: "baz", body: "", proto: "Function" },
      },
    },
    '{"foo":"[Mon Aug 08 2022 17:14:53 GMT+0100 (Western European Summer Time)]","baz":function baz() {}}',
  ],
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
      expect(formatMessage(input)).toStrictEqual(output);
    });
  });
});
