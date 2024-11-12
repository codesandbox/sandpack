import {
  Sandpack,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { githubLight, sandpackDark } from "@codesandbox/sandpack-themes";
/**
 * The only reason this is a separate import, is so
 * we don't need to make the full page 'use client', but only this copmponent.
 */
export const SandpackExamples = () => {
  return (
    <>
      <SandpackProvider template="vite-react-ts">
        <SandpackLayout>
          <SandpackFileExplorer />
          <SandpackCodeEditor closableTabs />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};
