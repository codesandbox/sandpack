/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Const
const GLOBAL = (function getGlobal(): any {
  if (typeof globalThis !== "undefined") return globalThis; // modern standard

  if (typeof window !== "undefined") return window; // browser

  if (typeof global !== "undefined") return global; // Node.js

  // eslint-disable-next-line no-restricted-globals
  if (typeof self !== "undefined") return self; // Web Worker

  throw Error("Unable to locate global object");
})();

const ARRAY_BUFFER_SUPPORTED = typeof ArrayBuffer === "function";
const MAP_SUPPORTED = typeof Map === "function";
const SET_SUPPORTED = typeof Set === "function";

export type TransformsTypes =
  | "Function"
  | "HTMLElement"
  | "[[NaN]]"
  | "[[undefined]]"
  | "[[Date]]"
  | "[[RegExp]]"
  | "[[Error]]"
  | "[[RegExp]]"
  | "[[Error]]"
  | "[[ArrayBuffer]]"
  | "[[TypedArray]]"
  | "[[Map]]"
  | "[[Set]]"
  | "Arithmetic";

type Transforms = Record<TransformsTypes, (...params: any) => any>;

enum Arithmetic {
  infinity,
  minusInfinity,
  minusZero,
}

export const transformers: Transforms = {
  Arithmetic: (data) => {
    if (data === Arithmetic.infinity) return Infinity;
    if (data === Arithmetic.minusInfinity) return -Infinity;
    if (data === Arithmetic.minusZero) return -0;

    return data;
  },
  HTMLElement: (data: {
    tagName: string;
    attributes: Record<string, string>;
    innerHTML: string;
  }) => {
    const sandbox = document.implementation.createHTMLDocument("sandbox");

    try {
      const element = sandbox.createElement(data.tagName);
      element.innerHTML = data.innerHTML;

      for (const attribute of Object.keys(data.attributes)) {
        try {
          element.setAttribute(attribute, data.attributes[attribute]);
        } catch {
          //
        }
      }
      return element;
    } catch (e) {
      return data;
    }
  },
  Function: (data) => {
    const tempFun = () => {};

    Object.defineProperty(tempFun, "toString", {
      value: () => `function ${data.name}() {${data.body}}`,
    });

    return tempFun;
  },

  "[[NaN]]": () => {
    return NaN;
  },

  "[[undefined]]": () => {
    return void 0;
  },

  "[[Date]]": (val: any) => {
    const date = new Date();

    date.setTime(val);
    return date;
  },

  "[[RegExp]]": (val: any) => {
    return new RegExp(val.src, val.flags);
  },

  "[[Error]]": (val: any) => {
    const Ctor = GLOBAL[val.name] || Error;
    const err = new Ctor(val.message);

    err.stack = val.stack;
    return err;
  },

  "[[ArrayBuffer]]": (val: any) => {
    if (ARRAY_BUFFER_SUPPORTED) {
      const buffer = new ArrayBuffer(val.length);
      const view = new Int8Array(buffer);

      view.set(val);

      return buffer;
    }

    return val;
  },

  "[[TypedArray]]": (val: any) => {
    return typeof GLOBAL[val.ctorName] === "function"
      ? new GLOBAL[val.ctorName](val.arr)
      : val.arr;
  },

  "[[Map]]": (val: any) => {
    if (MAP_SUPPORTED) {
      // NOTE: new Map(iterable) is not supported by all browsers
      const map = new Map();

      for (let i = 0; i < val.length; i += 2) map.set(val[i], val[i + 1]);

      return map;
    }

    const kvArr = [];

    // @ts-ignore
    for (let j = 0; j < val.length; j += 2) kvArr.push([val[i], val[i + 1]]);

    return kvArr;
  },

  "[[Set]]": (val: any) => {
    if (SET_SUPPORTED) {
      // NOTE: new Set(iterable) is not supported by all browsers
      const set = new Set();

      for (let i = 0; i < val.length; i++) set.add(val[i]);

      return set;
    }

    return val;
  },
};
