/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from "react";

import type { CodeEditorProps } from "../components/CodeEditor";
import { SandpackCodeEditor } from "../components/CodeEditor";
import { SandpackConsole } from "../components/Console";
import { SandpackPreview } from "../components/Preview";
import { SandpackTests } from "../components/Tests";
import { SandpackStack } from "../components/common";
import { SandpackLayout } from "../components/common/Layout";
import { ConsoleIcon } from "../components/icons";
import { SandpackProvider } from "../contexts/sandpackContext";
import { css, THEME_PREFIX } from "../styles";
import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../styles/shared";
import { SANDBOX_TEMPLATES } from "../templates";
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
export const Sandpack: SandpackInternal = ({
  options,
  template,
  customSetup,
  files,
  theme,
  ...props
}) => {
  // fallback values
  options ??= {};
  options.resizablePanels ??= true;
  options.editorWidthPercentage ??= 50;
  options.showConsole ??= false;

  const codeEditorOptions: CodeEditorProps = {
    showTabs: options.showTabs,
    showLineNumbers: options.showLineNumbers,
    showInlineErrors: options.showInlineErrors,
    wrapContent: options.wrapContent,
    closableTabs: options.closableTabs,
    initMode: options.initMode,
    extensions: options.codeEditor?.extensions,
    extensionsKeymap: options.codeEditor?.extensionsKeymap,
    readOnly: options.readOnly,
    showReadOnly: options.showReadOnly,
    id: options.id,
    additionalLanguages: options.codeEditor?.additionalLanguages,
  };

  const providerOptions: SandpackInternalOptions<
    SandpackFiles,
    SandpackPredefinedTemplate
  > = {
    /**
     * TS-why: Type 'string | number | symbol' is not assignable to type 'string'
     */
    activeFile: options.activeFile as unknown as string,
    visibleFiles: options.visibleFiles as unknown as string[],
    recompileMode: options.recompileMode,
    recompileDelay: options.recompileDelay,
    autorun: options.autorun,
    bundlerURL: options.bundlerURL,
    startRoute: options.startRoute,
    skipEval: options.skipEval,
    fileResolver: options.fileResolver,
    initMode: options.initMode,
    initModeObserverOptions: options.initModeObserverOptions,
    externalResources: options.externalResources,
    logLevel: options.logLevel,
    classes: options.classes,
  };

  /**
   * Console
   */
  const [consoleVisibility, setConsoleVisibility] = React.useState(
    options.showConsole
  );
  const [counter, setCounter] = React.useState(0);
  const hasRightColumn = options.showConsole || options.showConsoleButton;

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const templateFiles = SANDBOX_TEMPLATES[template!] ?? {};
  const mode = "mode" in templateFiles ? templateFiles.mode : "preview";

  const actionsChildren = options.showConsoleButton ? (
    <ConsoleCounterButton
      counter={counter}
      onClick={(): void => setConsoleVisibility((prev) => !prev)}
    />
  ) : undefined;

  /**
   * Resizable
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const dragEventTargetRef = React.useRef<any>(null);

  const [horizontalSize, setHorizontalSize] = React.useState(
    options.editorWidthPercentage
  );
  const [verticalSize, setVerticalSize] = React.useState(70);

  const RightColumn = hasRightColumn ? SandpackStack : React.Fragment;
  const rightColumnStyle = {
    flexGrow: 100 - horizontalSize,
    flexShrink: 100 - horizontalSize,
    flexBasis: 0,
    width: 100 - horizontalSize + "%",
    gap: consoleVisibility ? 1 : 0,
    height: options.editorHeight, // use the original editor height
  };
  const topRowStyle = hasRightColumn
    ? {
        flexGrow: verticalSize,
        flexShrink: verticalSize,
        flexBasis: 0,
        overflow: "hidden",
      }
    : rightColumnStyle;

  const onDragMove = (event: MouseEvent): void => {
    if (!dragEventTargetRef.current) return;

    const container = dragEventTargetRef.current.parentElement as
      | HTMLDivElement
      | undefined;

    if (!container) return;

    const direction = dragEventTargetRef.current.dataset.direction as
      | "horizontal"
      | "vertical";
    const isHorizontal = direction === "horizontal";

    const { left, top, height, width } = container.getBoundingClientRect();
    const offset = isHorizontal
      ? ((event.clientX - left) / width) * 100
      : ((event.clientY - top) / height) * 100;
    const boundaries = Math.min(Math.max(offset, 25), 75);

    if (isHorizontal) {
      setHorizontalSize(boundaries);
    } else {
      setVerticalSize(boundaries);
    }

    container.querySelectorAll(`.${THEME_PREFIX}-stack`).forEach((item) => {
      (item as HTMLDivElement).style.pointerEvents = "none";
    });
  };

  const stopDragging = (): void => {
    const container = dragEventTargetRef.current?.parentElement as
      | HTMLDivElement
      | undefined;

    if (!container) return;

    container.querySelectorAll(`.${THEME_PREFIX}-stack`).forEach((item) => {
      (item as HTMLDivElement).style.pointerEvents = "";
    });

    dragEventTargetRef.current = null;
  };

  React.useEffect(() => {
    if (!options?.resizablePanels) return;
    document.body.addEventListener("mousemove", onDragMove);
    document.body.addEventListener("mouseup", stopDragging);

    return (): void => {
      document.body.removeEventListener("mousemove", onDragMove);
      document.body.removeEventListener("mouseup", stopDragging);
    };
  }, [options]);

  React.useEffect(() => {
    setConsoleVisibility(options?.showConsole ?? false);
  }, [options.showConsole]);

  return (
    <SandpackProvider
      customSetup={customSetup}
      files={files as TemplateFiles<SandpackPredefinedTemplate>}
      options={providerOptions}
      template={template}
      theme={theme}
      {...props}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          {...codeEditorOptions}
          style={{
            height: options.editorHeight, // use the original editor height
            flexGrow: horizontalSize,
            flexShrink: horizontalSize,
            flexBasis: 0,
            overflow: "hidden",
          }}
        />

        {options.resizablePanels && (
          <div
            className={classNames(
              dragHandler({ direction: "horizontal" }),
              THEME_PREFIX + "-resize-handler"
            )}
            data-direction="horizontal"
            onMouseDown={(event): void => {
              dragEventTargetRef.current = event.target;
            }}
            style={{ left: `calc(${horizontalSize}% - 5px)` }}
          />
        )}

        {/* @ts-ignore */}
        <RightColumn
          className={THEME_PREFIX + "-preset-column"}
          style={rightColumnStyle}
        >
          {mode === "preview" && (
            <SandpackPreview
              actionsChildren={actionsChildren}
              showNavigator={options.showNavigator}
              showRefreshButton={options.showRefreshButton}
              style={topRowStyle}
            />
          )}

          {mode === "tests" && (
            <SandpackTests
              actionsChildren={actionsChildren}
              style={topRowStyle}
            />
          )}

          {(options.showConsoleButton || consoleVisibility) && (
            <>
              {options.resizablePanels && consoleVisibility && (
                <div
                  className={classNames(
                    dragHandler({ direction: "vertical" }),
                    THEME_PREFIX + "-resize-handler"
                  )}
                  data-direction="vertical"
                  onMouseDown={(event): void => {
                    dragEventTargetRef.current = event.target;
                  }}
                  style={{ top: `calc(${verticalSize}% - 5px)` }}
                />
              )}

              <div
                className={classNames(consoleWrapper)}
                style={{
                  flexGrow: consoleVisibility ? 100 - verticalSize : 0,
                  flexShrink: consoleVisibility ? 100 - verticalSize : 0,
                  flexBasis: 0,
                }}
              >
                <SandpackConsole
                  onLogsChange={(logs): void => setCounter(logs.length)}
                  showHeader={false}
                />
              </div>
            </>
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

const dragHandler = css({
  position: "absolute",
  zIndex: "$top",

  variants: {
    direction: {
      vertical: {
        right: 0,
        left: 0,
        height: 10,
        cursor: "ns-resize",
      },
      horizontal: {
        top: 0,
        bottom: 0,
        width: 10,
        cursor: "ew-resize",
      },
    },
  },

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
  width: "100%",
  overflow: "hidden",
});
