import type { Extension } from "@codemirror/state";
import type { DecorationSet, EditorView, ViewUpdate } from "@codemirror/view";
import { Decoration, ViewPlugin } from "@codemirror/view";

import type { CodeMirrorProps } from "../CodeEditor/CodeMirror";

import { getCodeMirrorPosition } from "./utils";

export function highlightDecorators(
  positions: CodeMirrorProps["decorators"]
): Extension {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.getDecoration(view);
      }

      update(update: ViewUpdate) {
        return;
      }

      getDecoration(view: EditorView) {
        if (!positions) return Decoration.none;

        const rangesDecorators = positions.map((item) => {
          const lineDeco = Decoration.line({
            attributes: { class: item.className ?? "" },
          });

          const positionLineStart =
            getCodeMirrorPosition(view.state.doc, { line: item.line }) + 1;

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
