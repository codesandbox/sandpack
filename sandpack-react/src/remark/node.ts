import { existsSync, readFileSync } from "fs";
import { basename, join } from "path";

import { valueToEstree } from "estree-util-value-to-estree";
import type { Node } from "unist-util-visit";
import { visit } from "unist-util-visit";

import type { SandpackFiles } from "../types";

export interface VFile {
  history: string[];
  cwd: string;
}

export interface JsxNodeElement extends Node {
  name: string;
  attributes: Array<{ name: string; type: string; value: unknown }>;
}

export interface CodeNodeElement extends JsxNodeElement {
  lang?: string;
  meta?: string;
  value?: string;
}

export interface CodeNodeMeta {
  name?: string;
  file?: string;
  active?: boolean;
  hidden?: boolean;
}

export const transformCode = (jsxNode: JsxNodeElement, file: VFile): void => {
  const files: SandpackFiles = {};
  visit(jsxNode, "code", (codeNode: CodeNodeElement) => {
    const meta = resolveCodeMeta(codeNode);
    let code = codeNode.value;

    if (meta.file) {
      const filePath = join(file.cwd, meta.file);
      if (existsSync(filePath)) {
        code = readFileSync(filePath, "utf8");

        meta.name ||= basename(filePath);
      }
    }

    if (meta.name) {
      files[meta.name] = {
        code: code || "",
        active: meta.active,
        hidden: meta.hidden,
      };
    }
  });

  appendProp(jsxNode, "files", files);
};

const resolveCodeMeta = (codeNode: CodeNodeElement): CodeNodeMeta => {
  /**
   * First attribute is treated as `lang` by visitor
   */
  const joinedMeta = codeNode.lang + " " + (codeNode.meta || "");
  return joinedMeta
    .split(" ")
    .filter((meta) => meta.length)
    .reduce((meta, expression) => {
      const [key, value] = expression.split("=");

      // TODO improve filename checking
      if (!value && /[\w]+\.[\w]+/.test(key)) {
        meta.name = key;
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        meta[key] = value || true;
      }
      return meta;
    }, {} as CodeNodeMeta);
};

const appendProp = (
  node: JsxNodeElement,
  propName: string,
  propValue: unknown
): void => {
  node.attributes.push({
    type: "mdxJsxAttribute",
    name: propName,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: JSON.stringify(propValue),
      data: {
        estree: {
          type: "Program",
          body: [
            {
              type: "ExpressionStatement",
              expression: valueToEstree(propValue),
            },
          ],
          sourceType: "module",
        },
      },
    },
  });
};
