/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Const
const GLOBAL = (function getGlobal() {
  // NOTE: see http://www.ecma-international.org/ecma-262/6.0/index.html#sec-performeval step 10
  const savedEval = eval;

  return savedEval("this");
})();

const ARRAY_BUFFER_SUPPORTED = typeof ArrayBuffer === "function";
const MAP_SUPPORTED = typeof Map === "function";
const SET_SUPPORTED = typeof Set === "function";

const TYPED_ARRAY_CTORS = [
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
];

type Transforms = Record<
  string,
  {
    shouldTransform(...params: any): boolean;
    fromSerializable(...params: any): any;
  }
>;

export const transformers: Transforms = {
  Function: {
    shouldTransform(type: any, obj: any) {
      return typeof obj === "function";
    },
    fromSerializable(data: Storage) {
      try {
        const tempFunc = function () {};

        if (typeof data.name === "string") {
          Object.defineProperty(tempFunc, "name", {
            value: data.name,
            writable: false,
          });
        }

        if (typeof data.body === "string") {
          Object.defineProperty(tempFunc, "body", {
            value: data.body,
            writable: false,
          });
        }

        if (typeof data.proto === "string") {
          // @ts-ignore
          tempFunc.constructor = {
            name: data.proto,
          };
        }

        return tempFunc;
      } catch (e) {
        return data;
      }
    },
  },

  "[[NaN]]": {
    shouldTransform(type: any, val: any) {
      return type === "number" && isNaN(val);
    },

    fromSerializable() {
      return NaN;
    },
  },

  "[[undefined]]": {
    shouldTransform(type: any) {
      return type === "undefined";
    },

    fromSerializable() {
      return void 0;
    },
  },
  "[[Date]]": {
    shouldTransform(type: any, val: any) {
      return val instanceof Date;
    },

    fromSerializable(val: any) {
      const date = new Date();

      date.setTime(val);
      return date;
    },
  },
  "[[RegExp]]": {
    shouldTransform(type: any, val: any) {
      return val instanceof RegExp;
    },

    fromSerializable(val: any) {
      return new RegExp(val.src, val.flags);
    },
  },

  "[[Error]]": {
    shouldTransform(type: any, val: any) {
      return val instanceof Error;
    },

    fromSerializable(val: any) {
      const Ctor = GLOBAL[val.name] || Error;
      const err = new Ctor(val.message);

      err.stack = val.stack;
      return err;
    },
  },

  "[[ArrayBuffer]]": {
    shouldTransform(type: any, val: any) {
      return ARRAY_BUFFER_SUPPORTED && val instanceof ArrayBuffer;
    },

    fromSerializable(val: any) {
      if (ARRAY_BUFFER_SUPPORTED) {
        const buffer = new ArrayBuffer(val.length);
        const view = new Int8Array(buffer);

        view.set(val);

        return buffer;
      }

      return val;
    },
  },

  "[[TypedArray]]": {
    shouldTransform(type: any, val: any) {
      if (ARRAY_BUFFER_SUPPORTED) {
        return ArrayBuffer.isView(val) && !(val instanceof DataView);
      }

      for (const ctorName of TYPED_ARRAY_CTORS) {
        if (
          typeof GLOBAL[ctorName] === "function" &&
          val instanceof GLOBAL[ctorName]
        )
          return true;
      }

      return false;
    },

    fromSerializable(val: any) {
      return typeof GLOBAL[val.ctorName] === "function"
        ? new GLOBAL[val.ctorName](val.arr)
        : val.arr;
    },
  },

  "[[Map]]": {
    shouldTransform(type: any, val: any) {
      return MAP_SUPPORTED && val instanceof Map;
    },

    fromSerializable(val: any) {
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
  },

  "[[Set]]": {
    shouldTransform(type: any, val: any) {
      return SET_SUPPORTED && val instanceof Set;
    },

    fromSerializable(val: any) {
      if (SET_SUPPORTED) {
        // NOTE: new Set(iterable) is not supported by all browsers
        const set = new Set();

        for (let i = 0; i < val.length; i++) set.add(val[i]);

        return set;
      }

      return val;
    },
  },
};
