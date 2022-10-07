import type { Transformer } from 'unified';
import { visit } from 'unist-util-visit';


import { transformCode } from './node';
import type { JsxNodeElement } from './types';


interface VFile {
  history: string[];
  cwd: string;
}

interface Options {
  /**
   * Specify custom component name, component will receive sandpack files as prop
   * @default Sandpack
   */
  componentName?: string;
}

export const transform = (options?: Options): Transformer => {
  const componentName = options?.componentName || 'Sandpack';
  return (tree, file: VFile):void => {
    visit(tree, 'mdxJsxFlowElement', (jsxNode: JsxNodeElement) => {
      if (jsxNode.name !== componentName) return;

      transformCode(jsxNode, file);
    });
  };
};
