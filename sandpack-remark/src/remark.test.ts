import {resolveCodeMeta} from './node'
import type { CodeNodeElement } from "./types";

// TODO since some dependencies are esm only, need some extra jest config
// describe("remark", () => {
//   test("transform works", () => {});
//   test("custom component name works", () => {});

//   test("file import works", () => {});

//   test("code meta works", () => {
//     const codeNode: CodeNodeElement = {
//       type: "",
//       name: "",
//       attributes: [],
//       lang: "bar.js",
//       meta: "file=/folder/code.ts active readOnly",
//     };

//     const codeMeta = resolveCodeMeta(codeNode)
//   });
// });
