import type { Extension } from "@codemirror/state";
import type { DecorationSet, EditorView, ViewUpdate } from "@codemirror/view";
import { Decoration, ViewPlugin } from "@codemirror/view";

import type { Decorators } from "../CodeEditor/CodeMirror";

import { getCodeMirrorPosition } from "./utils";

export function highlightDecorators(positions: Decorators): Extension {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.getDecoration(view);
      }

      update(update: ViewUpdate): void {
        return;
      }

      getDecoration(view: EditorView): DecorationSet {
        if (!positions) return Decoration.none;

        const rangesDecorators = positions.map((item) => {
          const lineDeco = Decoration.line({
            attributes: { class: item.className ?? "" },
          });

          const markDeco = Decoration.mark({
            class: item.className ?? "",
            attributes: item.elementAttributes ?? undefined,
          });

          const positionLineStart =
            getCodeMirrorPosition(view.state.doc, {
              line: item.line,
              column: item.startColumn,
            }) + 1;

          if (item.startColumn && item.endColumn) {
            const positionLineEnd =
              getCodeMirrorPosition(view.state.doc, {
                line: item.line,
                column: item.endColumn,
              }) + 1;

            return markDeco.range(positionLineStart, positionLineEnd);
          }

          return lineDeco.range(positionLineStart);
        });

        return Decoration.set(rangesDecorators);
      }
    },
    {
      decorations: (v) => v.decorations,
    }
  );
}
