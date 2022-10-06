import type { HighlightStyle } from "@codemirror/highlight";
import { highlightTree } from "@codemirror/highlight";
import type { LanguageSupport } from "@codemirror/language";
import { createElement } from "react";

export const useSyntaxHighlight = ({
  langSupport,
  highlightTheme,
  code = "",
}: {
  langSupport: LanguageSupport;
  highlightTheme: HighlightStyle;
  code?: string;
}): React.ReactNode[] => {
  const tree = langSupport.language.parser.parse(code);

  let offSet = 0;
  const codeElementsRender = [] as React.ReactNode[];

  const addElement = (to: number, className: string): void => {
    if (to > offSet) {
      const children = code.slice(offSet, to);

      codeElementsRender.push(
        className
          ? createElement("span", {
              children,
              className,
              key: `${to}${offSet}`,
            })
          : children
      );

      offSet = to;
    }
  };

  highlightTree(tree, highlightTheme.match, (from, to, className) => {
    addElement(from, "");
    addElement(to, className);
  });

  /**
   * The language parse doesn't look consistent.
   * The final syntax highlight used by CodeMirror
   * includes an end empty line, and the parse here doesn't,
   * so let's add it manually.
   */
  if (offSet < code.length) {
    codeElementsRender.push("\n\n");
  }

  return codeElementsRender;
};
