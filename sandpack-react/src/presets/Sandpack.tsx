import type { CSSProperties } from "@stitches/core";
import * as React from "react";

import { SandpackLayout } from "../common/Layout";
import type { CodeEditorProps } from "../components/CodeEditor";
import { SandpackCodeEditor } from "../components/CodeEditor";
import { SandpackConsole, useSandpackConsole } from "../components/Console";
import { SandpackPreview } from "../components/Preview";
import { SandpackProvider } from "../contexts/sandpackContext";
import { ConsoleIcon } from "../icons";
import { css, THEME_PREFIX } from "../styles";
import {
  buttonClassName,
  iconStandaloneClassName,
  actionButtonClassName,
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
  const editorPart = props.options?.editorWidthPercentage || 50;
  const previewPart = 100 - editorPart;

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
            minWidth: 700 * (editorPart / (previewPart + editorPart)),
          }}
        />

        {(props.options?.showConsoleButton || consoleVisibility) && (
          <div
            className={consoleWrapper.toString()}
            style={{
              borderTop: consoleVisibility ? "inherit" : "none",
              height: consoleVisibility
                ? getPreviewHeight(
                    consoleVisibility,
                    props.options?.editorHeight,
                    3
                  )
                : 0,
            }}
          >
            <SandpackConsole
              onLogsChange={(logs): void => setCounter(logs.length)}
              showHeader={false}
            />
          </div>
        )}

        <SandpackPreview
          actionsChildren={
            props.options?.showConsoleButton ? (
              <ConsoleCounterButton
                counter={counter}
                onClick={(): void => setConsoleVisibility((prev) => !prev)}
              />
            ) : undefined
          }
          showNavigator={props.options?.showNavigator}
          showRefreshButton={props.options?.showRefreshButton}
          style={{
            height: getPreviewHeight(
              consoleVisibility,
              props.options?.editorHeight,
              consoleVisibility ? 1.5 : 1
            ),
            flexGrow: previewPart,
            flexShrink: previewPart,
            minWidth: 700 * (previewPart / (previewPart + editorPart)),
          }}
        />
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
        actionButtonClassName,
        buttonCounter
      )}
      onClick={onClick}
    >
      <ConsoleIcon />
      {counter > 0 && <span>{counter}</span>}
    </button>
  );
};

const getPreviewHeight = (
  showConsoleButton?: boolean,
  editorHeight?: CSSProperties["height"],
  ratio = 2
): string | number | undefined => {
  if (showConsoleButton) {
    const height =
      typeof editorHeight === "number" ? `${editorHeight}px` : editorHeight;

    return `calc(${
      height ?? `var(--${THEME_PREFIX}-layout-height)`
    } / ${ratio})`;
  }

  return editorHeight;
};

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
  position: "absolute !important",
  bottom: 0,
  right: 0,
  left: "50%",
  zIndex: "$top",
  overflow: "hidden",
  height: "calc($layout$height / 2)",
  transition: "height $transitions$default",
});