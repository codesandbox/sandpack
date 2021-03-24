import { ClasserProvider } from "@code-hike/classer";
import * as React from "react";

import { SandpackLayout } from "../common/Layout";
import type { CodeEditorProps } from "../components/CodeEditor";
import { SandpackCodeEditor } from "../components/CodeEditor";
import type { PreviewProps } from "../components/Preview";
import { SandpackPreview } from "../components/Preview";
import { SandpackProvider } from "../contexts/sandpackContext";
import type {
  FileResolver,
  SandpackFiles,
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
    showTabs?: boolean;
    wrapContent?: boolean;

    bundlerURL?: string;
    startRoute?: string;
    skipEval?: boolean;
    fileResolver?: FileResolver;

    autorun?: boolean;
    recompileMode?: "immediate" | "delayed";
    recompileDelay?: number;
  };
}

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
  };

  const codeEditorOptions: CodeEditorProps = {
    showTabs: props.options?.showTabs,
    showLineNumbers: props.options?.showLineNumbers,
    wrapContent: props.options?.wrapContent,
  };

  const providerOptions = {
    openPaths: props.options?.openPaths,
    activePath: props.options?.activePath,
    recompileMode: props.options?.recompileMode,
    recompileDelay: props.options?.recompileDelay,
    autorun: props.options?.autorun ?? true,
    bundlerURL: props.options?.bundlerURL,
    startRoute: props.options?.startRoute,
    skipEval: props.options?.skipEval,
    fileResolver: props.options?.fileResolver,
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
