import { ClasserProvider } from "@code-hike/classer";
import * as React from "react";

import { SandpackLayout } from "../common/Layout";
import { SandpackPreview } from "../components/Preview";
import { SandpackProvider } from "../contexts/sandpackContext";
import { SANDBOX_TEMPLATES } from "../templates";
import type {
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackThemeProp,
} from "../types";

export interface SandpackRunnerProps {
  code?: string;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;
  theme?: SandpackThemeProp;
  options?: {
    showNavigator?: boolean;
    bundlerUrl?: string;
    startRoute?: string;
    classes?: Record<string, string>;
  };
}

export const SandpackRunner: React.FC<SandpackRunnerProps> = ({
  code,
  template,
  customSetup,
  options,
  theme,
}) => {
  const mainFile =
    customSetup?.main ?? SANDBOX_TEMPLATES[template || "vanilla"].main;

  // Override the main file of the sandbox
  const userInput = code
    ? {
        ...customSetup,
        files: {
          ...customSetup?.files,
          [mainFile]: code,
        },
      }
    : customSetup;

  return (
    <SandpackProvider
      bundlerURL={options?.bundlerUrl}
      customSetup={userInput}
      startRoute={options?.startRoute}
      template={template}
    >
      <ClasserProvider classes={options?.classes}>
        <SandpackLayout theme={theme}>
          <SandpackPreview showNavigator={options?.showNavigator} />
        </SandpackLayout>
      </ClasserProvider>
    </SandpackProvider>
  );
};
