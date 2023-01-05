/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from "react";

import { SANDBOX_TEMPLATES, SandpackStack } from "..";
import type { CodeEditorProps } from "../components/CodeEditor";
import { SandpackCodeEditor } from "../components/CodeEditor";
import { SandpackConsole } from "../components/Console";
import { SandpackPreview } from "../components/Preview";
import { SandpackTests } from "../components/Tests";
import { SandpackLayout } from "../components/common/Layout";
import { ConsoleIcon } from "../components/icons";
import { SandpackProvider } from "../contexts/sandpackContext";
import { css } from "../styles";
import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../styles/shared";
import type {
  SandpackInternal,
  SandpackInternalOptions,
  TemplateFiles,
  SandpackFiles,
  SandpackPredefinedTemplate,
} from "../types";
import { classNames } from "../utils/classNames";

/**
 * @hidden
 */
export const Sandpack: SandpackInternal = (props) => {
  const codeEditorOptions: CodeEditorProps = {
    showTabs: props.options?.showTabs,
    showLineNumbers: props.options?.showLineNumbers,
    showInlineErrors: props.options?.showInlineErrors,
    wrapContent: props.options?.wrapContent,
    closableTabs: props.options?.closableTabs,
    initMode: props.options?.initMode,
    extensions: props.options?.codeEditor?.extensions,
    extensionsKeymap: props.options?.codeEditor?.extensionsKeymap,
    readOnly: props.options?.readOnly,
    showReadOnly: props.options?.showReadOnly,
    id: props.options?.id,
    additionalLanguages: props.options?.codeEditor?.additionalLanguages,
  };

  const providerOptions: SandpackInternalOptions<
    SandpackFiles,
    SandpackPredefinedTemplate
  > = {
    /**
     * TS-why: Type 'string | number | symbol' is not assignable to type 'string'
     */
    activeFile: props.options?.activeFile as unknown as string,
    visibleFiles: props.options?.visibleFiles as unknown as string[],
    recompileMode: props.options?.recompileMode,
    recompileDelay: props.options?.recompileDelay,
    autorun: props.options?.autorun,
    bundlerURL: props.options?.bundlerURL,
    startRoute: props.options?.startRoute,
    skipEval: props.options?.skipEval,
    fileResolver: props.options?.fileResolver,
    initMode: props.options?.initMode,
    initModeObserverOptions: props.options?.initModeObserverOptions,
    externalResources: props.options?.externalResources,
    logLevel: props.options?.logLevel,
    classes: props.options?.classes,
  };

  const [consoleVisibility, setConsoleVisibility] = React.useState(
    props.options?.showConsole ?? false
  );
  const [counter, setCounter] = React.useState(0);

  /**
   * Parts are set as `flex` values, so they set the flex shrink/grow
   * Cannot use width percentages as it doesn't work with
   * the automatic layout break when the component is under 700px
   */
  const [editorPart, setEditorPart] = React.useState(
    props.options?.editorWidthPercentage || 50
  );
  const previewPart = 100 - editorPart;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const dragEventTargetRef = React.useRef<any>(null);

  const hasRightColumn =
    props.options?.showConsole || props.options?.showConsoleButton;
  const RightColumn = hasRightColumn ? SandpackStack : React.Fragment;
  const rightColumnStyle = {
    flexGrow: previewPart,
    flexShrink: previewPart,
    flexBasis: 0,
    gap: consoleVisibility ? 1 : 0,
    height: props.options?.editorHeight, // use the original editor height
  };

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const templateFiles = SANDBOX_TEMPLATES[props.template!] ?? {};
  const mode = "mode" in templateFiles ? templateFiles.mode : "preview";

  const actionsChildren = props.options?.showConsoleButton ? (
    <ConsoleCounterButton
      counter={counter}
      onClick={(): void => setConsoleVisibility((prev) => !prev)}
    />
  ) : undefined;

  React.useEffect(() => {
    setConsoleVisibility(props.options?.showConsole ?? false);
  }, [props.options?.showConsole]);

  const onMove = (event: MouseEvent): void => {
    if (!dragEventTargetRef.current) return;

    const container = dragEventTargetRef.current.parentElement;

    if (!container) return;

    const { left, width } = container.getBoundingClientRect();

    const offset = ((event.clientX - left) / width) * 100;
    const boundaries = Math.min(Math.max(offset, 25), 75);

    setEditorPart(boundaries);

    container.querySelectorAll("iframe").forEach((frame: HTMLIFrameElement) => {
      frame.style.pointerEvents = "none";
    });
  };

  const stopDragging = (): void => {
    const container = dragEventTargetRef.current?.parentElement;

    if (!container) return;

    container.querySelectorAll("iframe").forEach((frame: HTMLIFrameElement) => {
      frame.style.pointerEvents = "";
    });

    dragEventTargetRef.current = null;
  };

  React.useEffect(() => {
    document.body.addEventListener("mousemove", onMove);
    document.body.addEventListener("mouseup", stopDragging);

    return (): void => {
      document.body.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseup", stopDragging);
    };
  }, []);

  return (
    <SandpackProvider
      customSetup={props.customSetup}
      files={props.files as TemplateFiles<SandpackPredefinedTemplate>}
      options={providerOptions}
      template={props.template}
      theme={props.theme}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          {...codeEditorOptions}
          style={{
            height: props.options?.editorHeight, // use the original editor height
            flexGrow: editorPart,
            flexShrink: editorPart,
            flexBasis: 0,
            overflow: "hidden",
          }}
        />

        <div
          className={classNames(handler)}
          onMouseDown={(event): void => {
            dragEventTargetRef.current = event.target;
          }}
          style={{ left: `${editorPart}%` }}
        />

        {/* @ts-ignore */}
        <RightColumn style={rightColumnStyle}>
          {mode === "preview" && (
            <SandpackPreview
              actionsChildren={actionsChildren}
              showNavigator={props.options?.showNavigator}
              showRefreshButton={props.options?.showRefreshButton}
              style={hasRightColumn ? { flex: 1 } : rightColumnStyle}
            />
          )}
          {mode === "tests" && (
            <SandpackTests
              actionsChildren={actionsChildren}
              style={hasRightColumn ? { flex: 1 } : rightColumnStyle}
            />
          )}

          {(props.options?.showConsoleButton || consoleVisibility) && (
            <div
              className={consoleWrapper.toString()}
              style={{
                flex: consoleVisibility ? 0.5 : 0,
              }}
            >
              <SandpackConsole
                onLogsChange={(logs): void => setCounter(logs.length)}
                showHeader={false}
              />
            </div>
          )}
        </RightColumn>
      </SandpackLayout>
    </SandpackProvider>
  );
};

const ConsoleCounterButton: React.FC<{
  onClick: () => void;
  counter: number;
}> = ({ onClick, counter }) => {
  return (
    <button
      className={classNames(
        buttonClassName,
        iconStandaloneClassName,
        roundedButtonClassName,
        buttonCounter
      )}
      onClick={onClick}
    >
      <ConsoleIcon />
      {counter > 0 && <span>{counter}</span>}
    </button>
  );
};

const handler = css({
  position: "absolute",
  top: 0,
  bottom: 0,
  width: 4,
  zIndex: "$top",
  cursor: "ew-resize",

  "@media screen and (max-width: 768px)": {
    display: "none",
  },
});

const buttonCounter = css({
  position: "relative",

  span: {
    background: "$colors$clickable",
    color: "$colors$surface1",
    minWidth: 12,
    height: 12,
    padding: "0 2px",
    borderRadius: 12,
    fontSize: 8,
    lineHeight: "12px",
    position: "absolute",
    top: 0,
    right: 0,
  },
});

const consoleWrapper = css({
  transition: "flex $transitions$default",
  width: "100%",
  overflow: "hidden",
});
