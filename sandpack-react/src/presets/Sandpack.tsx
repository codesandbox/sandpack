/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from "react";

import type { CodeEditorProps } from "../components/CodeEditor";
import { SandpackCodeEditor } from "../components/CodeEditor";
import { SandpackConsole } from "../components/Console";
import { SandpackPreview } from "../components/Preview";
import { SandpackProvider } from "../components/SandpackProvider";
import { SandpackTests } from "../components/Tests";
import { SandpackStack } from "../components/common";
import { SandpackLayout } from "../components/common/Layout";
import { RoundedButton } from "../components/common/RoundedButton";
import { ConsoleIcon } from "../components/icons";
import { css, THEME_PREFIX } from "../styles";
import type { SandpackProviderProps, SandpackCodeOptions } from "../types";
import { useClassNames } from "../utils/classNames";

export type SandpackProps = SandpackProviderProps<any> & {
  editorWidthPercentage?: number;
  editorHeight?: React.CSSProperties["height"];

  /**
   * right to left layout
   * @default false
   */
  rtl?: boolean;
  showNavigator?: boolean;
  showLineNumbers?: boolean;
  showInlineErrors?: boolean;
  showRefreshButton?: boolean;
  showTabs?: boolean;
  showConsoleButton?: boolean;
  showConsole?: boolean;
  closableTabs?: boolean;
  wrapContent?: boolean;
  resizablePanels?: boolean;
  codeEditor?: SandpackCodeOptions;

  /**
   * This disables editing of content by the user in all files.
   */
  readOnly?: boolean;

  /**
   * Controls the visibility of Read-only label, which will only
   * appears when `readOnly` is `true`
   */
  showReadOnly?: boolean;

  layout?: "preview" | "tests" | "console";
};

export function Sandpack({
  resizablePanels,
  editorWidthPercentage,
  showConsole,
  ...props
}: SandpackProps) {
  resizablePanels ??= true;
  editorWidthPercentage ??= 50;
  showConsole ??= false;

  const rtlLayout = props?.rtl ?? false;
  const codeEditorOptions: CodeEditorProps = {
    showTabs: props.showTabs,
    showLineNumbers: props.showLineNumbers,
    showInlineErrors: props.showInlineErrors,
    wrapContent: props.wrapContent,
    closableTabs: props.closableTabs,
    initMode: props.initMode,
    extensions: props.codeEditor?.extensions,
    extensionsKeymap: props.codeEditor?.extensionsKeymap,
    readOnly: props.readOnly,
    showReadOnly: props.showReadOnly,
    additionalLanguages: props.codeEditor?.additionalLanguages,
  };

  /**
   * Console
   */
  const [consoleVisibility, setConsoleVisibility] = React.useState(showConsole);
  const [counter, setCounter] = React.useState(0);
  const hasRightColumn = showConsole || props.showConsoleButton;

  function getMode() {
    if (props?.layout) {
      return props.layout;
    }

    // TODO: Do people actually use this?
    /*
    const templateFiles = SANDBOX_TEMPLATES[props.sandbox.template!];
    if (typeof templateFiles === "object" && "mode" in templateFiles) {
      return templateFiles.mode;
    }
      */

    return "preview";
  }
  const mode = getMode();

  const actionsChildren = props.showConsoleButton ? (
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
    editorWidthPercentage
  );
  const [verticalSize, setVerticalSize] = React.useState(70);

  const RightColumn = hasRightColumn ? SandpackStack : React.Fragment;
  const rightColumnStyle = {
    flexGrow: 100 - horizontalSize,
    flexShrink: 100 - horizontalSize,
    flexBasis: 0,
    width: 100 - horizontalSize + "%",
    gap: consoleVisibility ? 1 : 0,
    height: props.editorHeight, // use the original editor height
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
      setHorizontalSize(rtlLayout ? 100 - boundaries : boundaries);
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
    if (!resizablePanels) return;
    document.body.addEventListener("mousemove", onDragMove);
    document.body.addEventListener("mouseup", stopDragging);

    return (): void => {
      document.body.removeEventListener("mousemove", onDragMove);
      document.body.removeEventListener("mouseup", stopDragging);
    };
  }, [resizablePanels]);

  React.useEffect(() => {
    setConsoleVisibility(showConsole ?? false);
  }, [showConsole]);

  const rightColumnProps = hasRightColumn
    ? { className: THEME_PREFIX + "-preset-column", style: rightColumnStyle }
    : {};

  const classNames = useClassNames();

  return (
    <SandpackProvider {...props}>
      <SandpackLayout
        className={
          rtlLayout ? classNames("rtl-layout", [rtlLayoutClassName]) : ""
        }
      >
        <SandpackCodeEditor
          {...codeEditorOptions}
          style={{
            height: props.editorHeight, // use the original editor height
            flexGrow: horizontalSize,
            flexShrink: horizontalSize,
            flexBasis: 0,
            overflow: "hidden",
          }}
        />

        {resizablePanels && (
          <div
            className={classNames("resize-handler", [
              dragHandler({ direction: "horizontal" }),
            ])}
            data-direction="horizontal"
            onMouseDown={(event): void => {
              dragEventTargetRef.current = event.target;
            }}
            style={{
              left: `calc(${
                rtlLayout ? 100 - horizontalSize : horizontalSize
              }% - 5px)`,
            }}
          />
        )}

        {/* @ts-ignore */}
        <RightColumn {...rightColumnProps}>
          {mode === "preview" && (
            <SandpackPreview
              actionsChildren={actionsChildren}
              showNavigator={props.showNavigator}
              showRefreshButton={props.showRefreshButton}
              style={topRowStyle}
            />
          )}

          {mode === "tests" && (
            <SandpackTests
              actionsChildren={actionsChildren}
              style={topRowStyle}
            />
          )}

          {mode === "console" && (
            <SandpackConsole
              actionsChildren={actionsChildren}
              style={topRowStyle}
              standalone
            />
          )}

          {(props.showConsoleButton || consoleVisibility) && (
            <>
              {resizablePanels && consoleVisibility && (
                <div
                  className={classNames("resize-handler", [
                    dragHandler({ direction: "vertical" }),
                  ])}
                  data-direction="vertical"
                  onMouseDown={(event): void => {
                    dragEventTargetRef.current = event.target;
                  }}
                  style={{ top: `calc(${verticalSize}% - 5px)` }}
                />
              )}

              <div
                className={classNames("console-wrapper", [consoleWrapper])}
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
}

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

const ConsoleCounterButton: React.FC<{
  onClick: () => void;
  counter: number;
}> = ({ onClick, counter }) => {
  return (
    <RoundedButton className={buttonCounter.toString()} onClick={onClick}>
      <ConsoleIcon />
      {counter > 0 && <strong>{counter}</strong>}
    </RoundedButton>
  );
};

const buttonCounter = css({
  position: "relative",

  strong: {
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
    fontWeight: "normal",
  },
});

const consoleWrapper = css({
  width: "100%",
  overflow: "hidden",
});

const rtlLayoutClassName = css({
  flexDirection: "row-reverse",

  "@media screen and (max-width: 768px)": {
    flexFlow: "wrap-reverse !important",
    flexDirection: "initial",
  },
});
