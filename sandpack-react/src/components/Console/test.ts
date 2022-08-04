// Const
const TRANSFORMED_TYPE_KEY = "@t";
const CIRCULAR_REF_KEY = "@r";
const KEY_REQUIRE_ESCAPING_RE = /^#*@(t|r)$/;

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
// Transforms
const builtInTransforms = {
  Function: {
    lookup: Function,
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

  ["[[NaN]]"]: {
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
    lookup: Date,

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
    lookup: RegExp,

    shouldTransform(type: any, val: any) {
      return val instanceof RegExp;
    },

    fromSerializable(val: any) {
      return new RegExp(val.src, val.flags);
    },
  },

  "[[Error]]": {
    lookup: Error,

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
    lookup: ARRAY_BUFFER_SUPPORTED && ArrayBuffer,

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
    lookup: MAP_SUPPORTED && Map,

    shouldTransform(type: any, val: any) {
      return MAP_SUPPORTED && val instanceof Map;
    },

    fromSerializable(val: any) {
      if (MAP_SUPPORTED) {
        // NOTE: new Map(iterable) is not supported by all browsers
        const map = new Map();

        for (var i = 0; i < val.length; i += 2) map.set(val[i], val[i + 1]);

        return map;
      }

      const kvArr = [];

      // @ts-ignore
      for (let j = 0; j < val.length; j += 2) kvArr.push([val[i], val[i + 1]]);

      return kvArr;
    },
  },

  "[[Set]]": {
    lookup: SET_SUPPORTED && Set,

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

class DecodingTransformer {
  references: any;
  transformMap: any;
  activeTransformsStack = [] as any;
  visitedRefs = Object.create(null);

  constructor(references: any, transformsMap: any) {
    this.references = references;
    this.transformMap = transformsMap;
  }

  _handlePlainObject(obj: any) {
    const unescaped = Object.create(null);

    if ("constructor" in obj) {
      if (!obj.constructor || typeof obj.constructor.name !== "string") {
        obj.constructor = {
          name: "Object",
        };
      }
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        this._handleValue(obj[key], obj, key);

        if (KEY_REQUIRE_ESCAPING_RE.test(key)) {
          // NOTE: use intermediate object to avoid unescaped and escaped keys interference
          // E.g. unescaped "##@t" will be "#@t" which can overwrite escaped "#@t".
          unescaped[key.substring(1)] = obj[key];
          delete obj[key];
        }
      }
    }

    for (const unsecapedKey in unescaped)
      obj[unsecapedKey] = unescaped[unsecapedKey];
  }

  _handleTransformedObject(obj: any, parent: any, key: any) {
    const transformType = obj[TRANSFORMED_TYPE_KEY];
    const transform = this.transformMap[transformType];

    if (!transform) {
      throw new Error(`Can't find transform for "${transformType}" type.`);
    }

    this.activeTransformsStack.push(obj);
    this._handleValue(obj.data, obj, "data");
    this.activeTransformsStack.pop();

    parent[key] = transform.fromSerializable(obj.data);
  }

  _handleCircularSelfRefDuringTransform(refIdx: any, parent: any, key: any) {
    // NOTE: we've hit a hard case: object reference itself during transformation.
    // We can't dereference it since we don't have resulting object yet. And we'll
    // not be able to restore reference lately because we will need to traverse
    // transformed object again and reference might be unreachable or new object contain
    // new circular references. As a workaround we create getter, so once transformation
    // complete, dereferenced property will point to correct transformed object.
    const references = this.references;

    Object.defineProperty(parent, key, {
      // @ts-ignore
      val: void 0,
      configurable: true,
      enumerable: true,

      get() {
        if (this.val === void 0) this.val = references[refIdx];

        return (<any>this).val;
      },

      set(value) {
        this.val = value;
      },
    });
  }

  _handleCircularRef(refIdx: any, parent: any, key: any) {
    if (this.activeTransformsStack.includes(this.references[refIdx]))
      this._handleCircularSelfRefDuringTransform(refIdx, parent, key);
    else {
      if (!this.visitedRefs[refIdx]) {
        this.visitedRefs[refIdx] = true;
        this._handleValue(this.references[refIdx], this.references, refIdx);
      }

      parent[key] = this.references[refIdx];
    }
  }

  _handleValue(val: any, parent: any, key: any) {
    if (typeof val !== "object" || val === null) return;

    const refIdx = val[CIRCULAR_REF_KEY];

    if (refIdx !== void 0) {
      this._handleCircularRef(refIdx, parent, key);
    } else if (val[TRANSFORMED_TYPE_KEY]) {
      this._handleTransformedObject(val, parent, key);
    } else if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) this._handleValue(val[i], val, i);
    } else {
      this._handlePlainObject(val);
    }
  }

  transform() {
    this.visitedRefs[0] = true;
    this._handleValue(this.references[0], this.references, 0);

    return this.references[0];
  }
}

export const decoder = (value) => {
  const parser = new DecodingTransformer(value, builtInTransforms);

  return parser.transform();
};
