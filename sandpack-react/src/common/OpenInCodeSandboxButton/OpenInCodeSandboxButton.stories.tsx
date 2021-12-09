import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackCodeEditor,
} from "../../";

import { OpenInCodeSandboxButton, UnstyledOpenInCodeSandboxButton } from ".";

export default {
  title: "components/OpenInCodeSandboxButton",
  component: OpenInCodeSandboxButton,
};

export const Main = (): JSX.Element => (
  <SandpackProvider>
    <SandpackThemeProvider>
      <SandpackCodeEditor />
      <OpenInCodeSandboxButton />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const Unstyled = (): JSX.Element => (
  <SandpackProvider>
    <SandpackThemeProvider>
      <SandpackCodeEditor />
      <UnstyledOpenInCodeSandboxButton>
        Open in CodeSandbox
      </UnstyledOpenInCodeSandboxButton>
    </SandpackThemeProvider>
  </SandpackProvider>
);
