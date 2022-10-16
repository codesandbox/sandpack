import type Stitches from "@stitches/core/types/stitches";

const toString = (): string => "";
const doubleToString = (): typeof toString => toString;

const defineProperty = Object.getOwnPropertyDescriptors({ toString });

Object.defineProperties(toString, defineProperty);
Object.defineProperties(doubleToString, defineProperty);

export const createStitchesMock = {
  createTheme: toString,
  css: doubleToString,
  getCssText: toString,
  keyframes: doubleToString,
} as unknown as Stitches;
