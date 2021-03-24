import { useClasser } from "@code-hike/classer";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import {
  defaultKeymap,
  indentLess,
  deleteGroupBackward,
  insertTab,
} from "@codemirror/commands";
import { commentKeymap } from "@codemirror/comment";
import { lineNumbers } from "@codemirror/gutter";
import { history, historyKeymap } from "@codemirror/history";
import { bracketMatching } from "@codemirror/matchbrackets";
import { EditorState } from "@codemirror/state";
import {
  highlightSpecialChars,
  highlightActiveLine,
  keymap,
  EditorView,
} from "@codemirror/view";
import type { KeyBinding } from "@codemirror/view";
import * as React from "react";

import { useSandpackTheme } from "../../hooks/useSandpackTheme";
import type { EditorState as SandpackEditorState } from "../../types";
import { getFileName } from "../../utils/stringUtils";

import {
  getCodeMirrorLanguage,
  getEditorTheme,
  getSyntaxHighlight,
} from "./utils";

export interface CodeMirrorProps {
  code: string;
  filePath?: string;
  fileType?:
    | "js"
    | "jsx"
    | "ts"
    | "tsx"
    | "css"
    | "scss"
    | "less"
    | "html"
    | "vue";
  onCodeUpdate: (newCode: string) => void;
  showLineNumbers?: boolean;
  wrapContent?: boolean;
  editorState?: SandpackEditorState;
}

export const CodeMirror: React.FC<CodeMirrorProps> = ({
  code,
  filePath,
  fileType,
  onCodeUpdate,
  showLineNumbers = false,
  wrapContent = false,
  editorState = "pristine",
}) => {
  const wrapper = React.useRef<HTMLDivElement>(null);
  const cmView = React.useRef<EditorView>();
  const { theme, themeId } = useSandpackTheme();
  const [internalCode, setInternalCode] = React.useState<string>(code);
  const c = useClasser("sp");

  React.useEffect(() => {
    if (!wrapper.current) {
      return () => {
        return;
      };
    }

    const langSupport = getCodeMirrorLanguage(filePath, fileType);

    const customCommandsKeymap: KeyBinding[] = [
      {
        key: "Tab",
        run: insertTab,
      },
      {
        key: "Shift-Tab",
        run: indentLess,
      },
      {
        key: "Escape",
        run: () => {
          if (wrapper.current) {
            wrapper.current.focus();
          }

          return true;
        },
      },
      {
        key: "mod-Backspace",
        run: deleteGroupBackward,
      },
    ];

    const extensions = [
      highlightSpecialChars(),
      history(),
      bracketMatching(),
      closeBrackets(),
      highlightActiveLine(),

      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...commentKeymap,
        ...customCommandsKeymap,
      ]),
      langSupport,

      getEditorTheme(theme),
      getSyntaxHighlight(theme),
    ];

    if (wrapContent) {
      extensions.push(EditorView.lineWrapping);
    }

    if (showLineNumbers) {
      extensions.push(lineNumbers());
    }

    const startState = EditorState.create({
      doc: code,
      extensions,
    });

    const parentDiv = wrapper.current;
    const existingPlaceholder = parentDiv.querySelector(".sp-pre-placeholder");
    if (existingPlaceholder) {
      parentDiv.removeChild(existingPlaceholder);
    }

    const view = new EditorView({
      state: startState,
      parent: parentDiv,
      dispatch: (tr) => {
        view.update([tr]);

        if (tr.docChanged) {
          const newCode = tr.newDoc.sliceString(0, tr.newDoc.length);
          setInternalCode(newCode);
          onCodeUpdate(newCode);
        }
      },
    });

    view.contentDOM.setAttribute("tabIndex", "-1");
    view.contentDOM.setAttribute("aria-describedby", "exit-instructions");

    cmView.current = view;

    return () => {
      view.destroy();
    };

    // TODO: Would be nice to reconfigure the editor when these change, instead of recreating with all the extensions from scratch
  }, [showLineNumbers, wrapContent, themeId]);

  React.useEffect(() => {
    // When the user clicks on a tab button on a larger screen
    // Avoid autofocus on mobile as it leads to a bad experience and an unexpected layout shift
    if (
      cmView.current &&
      editorState === "dirty" &&
      window.matchMedia("(min-width: 768px)").matches
    ) {
      cmView.current.contentDOM.focus();
    }
  }, []);

  // Update editor when code passed as prop from outside sandpack changes
  React.useEffect(() => {
    if (cmView.current && code !== internalCode) {
      const view = cmView.current;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length - 1, insert: code },
      });
    }
  }, [code]);

  const handleContainerKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key === "Enter" && cmView.current) {
      evt.preventDefault();
      cmView.current.contentDOM.focus();
    }
  };

  return (
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    <div
      ref={wrapper}
      aria-describedby="enter-instructions"
      aria-label={
        filePath ? `Code Editor for ${getFileName(filePath)}` : `Code Editor`
      }
      className={c("cm", editorState)}
      onKeyDown={handleContainerKeyDown}
      role="group"
      tabIndex={0}
    >
      <pre
        className={c("pre-placeholder")}
        style={{
          marginLeft: showLineNumbers ? 28 : 0, // gutter line offset
        }}
      >
        {code}
      </pre>
      <p id="enter-instructions" style={{ display: "none" }}>
        To enter the code editing mode, press Enter. To exit the edit mode,
        press Escape
      </p>
      <p id="exit-instructions" style={{ display: "none" }}>
        You are editing the code. To exit the edit mode, press Escape
      </p>
    </div>
  );
};
