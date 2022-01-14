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
import { defaultHighlightStyle } from "@codemirror/highlight";
import { history, historyKeymap } from "@codemirror/history";
import { bracketMatching } from "@codemirror/matchbrackets";
import { EditorState } from "@codemirror/state";
import type { Annotation, Extension } from "@codemirror/state";
import {
  highlightSpecialChars,
  highlightActiveLine,
  keymap,
  EditorView,
} from "@codemirror/view";
import type { KeyBinding } from "@codemirror/view";
import useIntersectionObserver from "@react-hook/intersection-observer";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { useSandpackTheme } from "../../hooks/useSandpackTheme";
import type {
  EditorState as SandpackEditorState,
  SandpackInitMode,
} from "../../types";
import { getFileName, generateRandomId } from "../../utils/stringUtils";

import { highlightDecorators } from "./highlightDecorators";
import { highlightInlineError } from "./highlightInlineError";
import {
  getCodeMirrorLanguage,
  getEditorTheme,
  getSyntaxHighlight,
  useCombinedRefs,
} from "./utils";

export type Decorators = Array<{
  className?: string;
  line: number;
  startColumn?: number;
  endColumn?: number;
  elementAttributes?: Record<string, string>;
}>;

interface CodeMirrorProps {
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
  onCodeUpdate?: (newCode: string) => void;
  showLineNumbers?: boolean;
  showInlineErrors?: boolean;
  wrapContent?: boolean;
  editorState?: SandpackEditorState;
  /**
   * This disables editing of content by the user in all files.
   */
  readOnly?: boolean;
  /**
   * Controls the visibility of Read-only label, which will only
   * appears when `readOnly` is `true`
   */
  showReadOnly?: boolean;
  decorators?: Decorators;
  initMode: SandpackInitMode;
  id?: string;
  extensions?: Extension[];
  extensionsKeymap?: Array<readonly KeyBinding[]>;
}

export interface CodeMirrorRef {
  getCodemirror: () => EditorView | undefined;
}

/**
 * @category Components
 */
export const CodeMirror = React.forwardRef<CodeMirrorRef, CodeMirrorProps>(
  (
    {
      code,
      filePath,
      fileType,
      onCodeUpdate,
      showLineNumbers = false,
      showInlineErrors = false,
      wrapContent = false,
      editorState = "pristine",
      readOnly = false,
      showReadOnly = true,
      decorators,
      initMode = "lazy",
      id,
      extensions = [],
      extensionsKeymap = [],
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper = React.useRef<any | HTMLElement>(null);
    const cmView = React.useRef<EditorView>();
    const { theme, themeId } = useSandpackTheme();
    const [internalCode, setInternalCode] = React.useState<string>(code);
    const [shouldInitEditor, setShouldInitEditor] = React.useState(
      initMode === "immediate"
    );

    const c = useClasser("sp");
    const { listen } = useSandpack();
    const ariaId = React.useRef<string>(id ?? generateRandomId());

    const { isIntersecting } = useIntersectionObserver(wrapper, {
      rootMargin: "600px 0px",
      threshold: 0.2,
    });

    React.useImperativeHandle(ref, () => ({
      getCodemirror: (): EditorView | undefined => cmView.current,
    }));

    React.useEffect(() => {
      const mode = initMode === "lazy" || initMode === "user-visible";

      if (mode && isIntersecting) {
        setShouldInitEditor(true);
      }
    }, [initMode, isIntersecting]);

    React.useEffect(() => {
      if (!wrapper.current || !shouldInitEditor) return;

      /**
       * TODO: replace this time out to something more efficient
       * waiting for "postTask scheduler" API be ready
       */
      const timer = setTimeout(function delayCodeEditorInit() {
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
            run: (): boolean => {
              if (readOnly) return true;

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

        const extensionList = [
          highlightSpecialChars(),
          history(),
          closeBrackets(),

          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...commentKeymap,
            ...customCommandsKeymap,
            ...extensionsKeymap,
          ] as KeyBinding[]),
          langSupport,

          defaultHighlightStyle.fallback,

          getEditorTheme(theme),
          getSyntaxHighlight(theme),
          ...extensions,
        ];

        if (readOnly) {
          extensionList.push(EditorView.editable.of(false));
        } else {
          extensionList.push(bracketMatching());
          extensionList.push(highlightActiveLine());
        }

        if (decorators) {
          extensionList.push(highlightDecorators(decorators));
        }

        if (wrapContent) {
          extensionList.push(EditorView.lineWrapping);
        }

        if (showLineNumbers) {
          extensionList.push(lineNumbers());
        }

        if (showInlineErrors) {
          extensionList.push(highlightInlineError());
        }

        const startState = EditorState.create({
          doc: code,
          extensions: extensionList,
        });

        const parentDiv = wrapper.current;

        const view = new EditorView({
          state: startState,
          parent: parentDiv,
          dispatch: (tr): void => {
            view.update([tr]);

            if (tr.docChanged) {
              const newCode = tr.newDoc.sliceString(0, tr.newDoc.length);
              setInternalCode(newCode);
              onCodeUpdate?.(newCode);
            }
          },
        });

        view.contentDOM.setAttribute("data-gramm", "false");

        if (!readOnly) {
          view.contentDOM.setAttribute("tabIndex", "-1");
          view.contentDOM.setAttribute(
            "aria-describedby",
            `exit-instructions-${ariaId.current}`
          );
        }

        cmView.current = view;
      }, 0);

      return (): void => {
        cmView.current?.destroy();

        clearTimeout(timer);
      };

      // TODO: Would be nice to reconfigure the editor when these change, instead of recreating with all the extensions from scratch
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldInitEditor, showLineNumbers, wrapContent, themeId, decorators]);

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update editor when code passed as prop from outside sandpack changes
    React.useEffect(() => {
      if (cmView.current && code !== internalCode) {
        const view = cmView.current;
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: code },
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    React.useEffect(
      function messageToInlineError() {
        if (!showInlineErrors) return;

        const unsubscribe = listen((message) => {
          const view = cmView.current;

          if (message.type === "success") {
            view?.dispatch({
              // Pass message to clean up inline error
              annotations: [
                {
                  type: "clean-error",
                  value: null,
                } as unknown as Annotation<unknown>,
              ],

              // Trigger a doc change to remove inline error
              changes: {
                from: 0,
                to: view.state.doc.length,
                insert: view.state.doc,
              },
              selection: view.state.selection,
            });
          }

          if (
            message.type === "action" &&
            message.action === "show-error" &&
            "line" in message
          ) {
            view?.dispatch({
              annotations: [
                {
                  type: "error",
                  value: message.line,
                } as unknown as Annotation<unknown>,
              ],
            });
          }
        });

        return (): void => unsubscribe();
      },
      [listen, showInlineErrors]
    );

    const handleContainerKeyDown = (evt: React.KeyboardEvent): void => {
      if (evt.key === "Enter" && cmView.current) {
        evt.preventDefault();
        cmView.current.contentDOM.focus();
      }
    };

    const combinedRef = useCombinedRefs(wrapper, ref);

    if (readOnly) {
      return (
        <pre ref={combinedRef} className={c("cm", editorState)} translate="no">
          {!shouldInitEditor && (
            <code className={c("pre-placeholder")}>{code}</code>
          )}

          {readOnly && showReadOnly && (
            <span className={c("read-only")}>Read-only</span>
          )}
        </pre>
      );
    }

    return (
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      <div
        ref={combinedRef}
        aria-describedby={`enter-instructions-${ariaId.current}`}
        aria-label={
          filePath ? `Code Editor for ${getFileName(filePath)}` : `Code Editor`
        }
        className={c("cm", editorState)}
        onKeyDown={handleContainerKeyDown}
        role="group"
        tabIndex={0}
        translate="no"
      >
        {!shouldInitEditor && (
          <pre
            className={c("pre-placeholder")}
            style={{
              marginLeft: showLineNumbers ? 28 : 0, // gutter line offset
            }}
          >
            {code}
          </pre>
        )}

        <>
          <p
            id={`enter-instructions-${ariaId.current}`}
            style={{ display: "none" }}
          >
            To enter the code editing mode, press Enter. To exit the edit mode,
            press Escape
          </p>
          <p
            id={`exit-instructions-${ariaId.current}`}
            style={{ display: "none" }}
          >
            You are editing the code. To exit the edit mode, press Escape
          </p>
        </>
      </div>
    );
  }
);
