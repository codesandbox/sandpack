import * as React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";

import * as OpenOn from "./OpenInCodeSandboxButton";

import {
  ErrorOverlay,
  SandpackLayout,
  LoadingOverlay,
  RunButton,
  SandpackStack,
} from "./";

export default {
  title: "components/Common",
};

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SandpackProvider>
    <SandpackLayout>{children}</SandpackLayout>
  </SandpackProvider>
);

export const OpenInCodeSandboxButton: React.FC = () => (
  <Provider>
    <OpenOn.OpenInCodeSandboxButton />
  </Provider>
);

export const UnstyledOpenInCodeSandboxButton: React.FC = () => (
  <SandpackProvider>
    <OpenOn.UnstyledOpenInCodeSandboxButton>
      Open on CodeSandbox
    </OpenOn.UnstyledOpenInCodeSandboxButton>
  </SandpackProvider>
);

export const ErrorOverlayStory: React.FC = () => (
  <Provider>
    <div style={{ width: "100%", height: 200, position: "relative" }}>
      <ErrorOverlay>Error message</ErrorOverlay>
    </div>
  </Provider>
);

export const SandpackLayoutStory: React.FC = () => (
  <SandpackProvider>
    <SandpackLayout>Layout</SandpackLayout>
  </SandpackProvider>
);

export const LoadingOverlayStory: React.FC = () => (
  <Provider>
    <div style={{ width: "100%", height: 200, position: "relative" }}>
      <LoadingOverlay showOpenInCodeSandbox />
    </div>
  </Provider>
);

export const RunButtonStory: React.FC = () => (
  <Provider>
    <div style={{ width: "100%", height: 200, position: "relative" }}>
      <RunButton />
    </div>
  </Provider>
);

export const StackStory: React.FC = () => (
  <Provider>
    <SandpackStack>
      <div style={{ width: 100, height: 100, backgroundColor: "red" }} />
      <div style={{ width: 100, height: 100, backgroundColor: "blue" }} />
    </SandpackStack>
  </Provider>
);
