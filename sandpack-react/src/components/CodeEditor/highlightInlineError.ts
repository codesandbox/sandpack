/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Extension } from "@codemirror/state";
import type { DecorationSet, ViewUpdate } from "@codemirror/view";
import { Decoration, ViewPlugin } from "@codemirror/view";

import { getCodeMirrorPosition } from "../CodeEditor/utils";

export function highlightInlineError(): Extension {
  return activeLineHighlighter;
}

const lineDeco = Decoration.line({ attributes: { class: "cm-errorLine" } });

const activeLineHighlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor() {
      this.decorations = Decoration.none;
    }

    update(update: ViewUpdate): void {
      update.transactions.forEach((trans) => {
        type TransType = "show-error" | "remove-errors";

        // @ts-ignore
        const errorValue = trans.annotation<TransType>("show-error");
        if (errorValue !== undefined) {
          const position =
            getCodeMirrorPosition(update.view.state.doc, {
              line: errorValue as unknown as number,
            }) + 1;

          this.decorations = Decoration.set([lineDeco.range(position)]);
          // @ts-ignore
        } else if (trans.annotation<TransType>("remove-errors")) {
          this.decorations = Decoration.none;
        }
      });
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);
