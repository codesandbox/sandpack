/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import jsdom from "jsdom";

import type { Message } from "./fromConsoleToString";
import { fromConsoleToString } from "./fromConsoleToString";

global.window = new jsdom.JSDOM().window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;

const references = [
  null, // the first item is the log itself
  {
    "@t": "Function",
    data: { name: "", body: "", proto: "Function" },
  },
  [{ "@r": 1 }],
  "foo",
  [123, { "@r": 3 }],
  // self-pointing
  [{ "@r": 6 }],
  { foo: { "@r": 5 } },
];

const cases: Array<[Message, string]> = [
  /**
   * Primitives
   */
  ["Lorem ipsum", '"Lorem ipsum"'],
  [123, "123"],
  [true, "true"],
  [{ data: {} }, "{ data: {} }"],
  [[], "[]"],
  [{ "@t": "[[undefined]]", data: "" }, "undefined"],
  [Symbol("foo"), "Symbol(foo)"],
  [null, "null"],
  [Infinity, "Infinity"],
  [
    { constructor: { name: "CustomThing" } },
    'CustomThing { constructor: { name: "CustomThing" } }',
  ],
  [
    {
      "0": {
        "#@t": "HTMLElement",
        data: {
          tagName: "button",
          attributes: {},
          innerHTML: "Test",
        },
      },
      "1": {
        "#@t": "HTMLElement",
        data: {
          tagName: "button",
          attributes: {
            onclick: "console.log(document.querySelectorAll('button'))",
          },
          innerHTML: "Log",
        },
      },
      entries: {
        "#@t": "Function",
        data: {
          name: "entries",
          body: "",
          proto: "Function",
        },
      },
      keys: {
        "#@t": "Function",
        data: {
          name: "keys",
          body: "",
          proto: "Function",
        },
      },
      values: {
        "#@t": "Function",
        data: {
          name: "values",
          body: "",
          proto: "Function",
        },
      },
      forEach: {
        "#@t": "Function",
        data: {
          name: "forEach",
          body: "",
          proto: "Function",
        },
      },
      length: 2,
      item: {
        "#@t": "Function",
        data: {
          name: "item",
          body: "",
          proto: "Function",
        },
      },
      constructor: {
        name: "NodeList",
      },
    },
    `NodeList(2)[<button>Test</button>,<button onclick="console.log(document.querySelectorAll('button'))">Log</button>]`,
  ],

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
    "Fri Aug 05 2022 17:35:15 GMT+0000 (Coordinated Universal Time)",
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
    "{ foo: [Mon Aug 08 2022 16:14:53 GMT+0000 (Coordinated Universal Time)], baz: function baz() {} }",
  ],
  [
    {
      foo: { anotherFoo: [123, "string", []] },
      baz: {
        "@t": "Function",
        data: { name: "baz", body: "", proto: "Function" },
      },
    },
    '{ foo: { anotherFoo: [123, "string", []] }, baz: function baz() {} }',
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
      { "@t": "[[Date]]", data: 1659975293702 },
    ],
    '[123, "foo", function myFunction() {}, [123, "anotherFoo", function anotherFunction() {}], Mon Aug 08 2022 16:14:53 GMT+0000 (Coordinated Universal Time)]',
  ],

  /**
   * Recursive references
   */
  [{ "@r": 1 }, "function () {}"],
  [{ "@r": 2 }, "[function () {}]"],
  [{ "@r": 4 }, '[123, "foo"]'],
];

describe(fromConsoleToString, () => {
  it("should format message", () => {
    cases.forEach(([input, output]) => {
      expect(fromConsoleToString(input, references)).toStrictEqual(output);
    });
  });
});
