import { ClasserProvider } from "@code-hike/classer";
import type { SandpackLogLevel } from "@codesandbox/sandpack-client";
import * as React from "react";

import { SandpackLayout } from "../common/Layout";
import type { CodeEditorProps } from "../components/CodeEditor";
import { SandpackCodeEditor } from "../components/CodeEditor";
import type { PreviewProps } from "../components/Preview";
import { SandpackPreview } from "../components/Preview";
import type { SandpackProviderProps } from "../contexts/sandpackContext";
import { SandpackProvider } from "../contexts/sandpackContext";
import type {
  SandpackCodeOptions,
  FileResolver,
  SandpackFiles,
  SandpackInitMode,
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackThemeProp,
} from "../types";

export interface SandpackProps {
  files?: SandpackFiles;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;

  theme?: SandpackThemeProp;

  options?: {
    openPaths?: string[];
    activePath?: string;

    editorWidthPercentage?: number;
    editorHeight?: React.CSSProperties["height"];
    classes?: Record<string, string>;

    showNavigator?: boolean;
    showLineNumbers?: boolean;
    showInlineErrors?: boolean;
    showOpenInCodeSandbox?: boolean;
    showTabs?: boolean;
    closableTabs?: boolean;
    wrapContent?: boolean;
    /**
     * This provides a way to control how some components are going to
     * be initialized on the page. The CodeEditor and the Preview components
     * are quite expensive and might overload the memory usage, so this gives
     * a certain control of when to initialize them.
     */
    initMode?: SandpackInitMode;
    initModeObserverOptions?: IntersectionObserverInit;

    bundlerURL?: string;
    startRoute?: string;
    skipEval?: boolean;
    fileResolver?: FileResolver;
    externalResources?: string[];

    autorun?: boolean;
    recompileMode?: "immediate" | "delayed";
    recompileDelay?: number;
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
    logLevel?: SandpackLogLevel;
  };
}

/**
 * @category Presets
 */
export const Sandpack: React.FC<SandpackProps> = (props) => {
  // Combine files with customSetup to create the user input structure
  const userInputSetup = props.files
    ? {
        ...props.customSetup,
        files: {
          ...props.customSetup?.files,
          ...props.files,
        },
      }
    : props.customSetup;

  const previewOptions: PreviewProps = {
    showNavigator: props.options?.showNavigator,
    showOpenInCodeSandbox: props?.options?.showOpenInCodeSandbox,
  };

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
  };

  const providerOptions: SandpackProviderProps = {
    openPaths: props.options?.openPaths,
    activePath: props.options?.activePath,
    recompileMode: props.options?.recompileMode,
    recompileDelay: props.options?.recompileDelay,
    autorun: props.options?.autorun ?? true,
    bundlerURL: props.options?.bundlerURL,
    startRoute: props.options?.startRoute,
    skipEval: props.options?.skipEval,
    fileResolver: props.options?.fileResolver,
    initMode: props.options?.initMode,
    initModeObserverOptions: props.options?.initModeObserverOptions,
    externalResources: props.options?.externalResources,
    logLevel: props.options?.logLevel,
  };

  // Parts are set as `flex` values, so they set the flex shrink/grow
  // Cannot use width percentages as it doesn't work with
  // the automatic layout break when the component is under 700px
  const editorPart = props.options?.editorWidthPercentage || 50;
  const previewPart = 100 - editorPart;
  const editorHeight = props.options?.editorHeight;

  return (
    <SandpackProvider
      customSetup={userInputSetup}
      template={props.template}
      {...providerOptions}
    >
      <ClasserProvider classes={props.options?.classes}>
        <SandpackLayout theme={props.theme}>
          <SandpackCodeEditor
            {...codeEditorOptions}
            customStyle={{
              height: editorHeight,
              flexGrow: editorPart,
              flexShrink: editorPart,
              minWidth: 700 * (editorPart / (previewPart + editorPart)),
            }}
          />
          <SandpackPreview
            {...previewOptions}
            customStyle={{
              height: editorHeight,
              flexGrow: previewPart,
              flexShrink: previewPart,
              minWidth: 700 * (previewPart / (previewPart + editorPart)),
            }}
          />
        </SandpackLayout>
      </ClasserProvider>
    </SandpackProvider>
  );
};
