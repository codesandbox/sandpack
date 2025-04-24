import * as React from "react";

import { SandpackSandboxProvider } from "../../contexts/SandpackSandboxContext";
import { SandpackStateProvider } from "../../contexts/SandpackStateContext";
import { SandpackThemeProvider } from "../../styles/themeContext";
import type { SandpackProviderProps } from "../../types";
import { ClassNamesProvider } from "../../utils/classNames";

export function SandpackProvider(props: SandpackProviderProps) {
  const {
    children,
    environmentOptions,
    style,
    className,
    theme,
    sandbox,
    classes,
  } = props;

  return (
    <SandpackSandboxProvider options={environmentOptions} sandbox={sandbox}>
      <React.Suspense fallback="Loading...">
        <SandpackStateProvider
          onChange={props.onChange}
          sandboxConfiguration={
            typeof sandbox === "function" ? undefined : sandbox
          }
        >
          <ClassNamesProvider classes={classes}>
            <SandpackThemeProvider
              className={className}
              style={style}
              theme={theme}
            >
              {children}
            </SandpackThemeProvider>
          </ClassNamesProvider>
        </SandpackStateProvider>
      </React.Suspense>
    </SandpackSandboxProvider>
  );
}
