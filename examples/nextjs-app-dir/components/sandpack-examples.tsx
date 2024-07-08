import { Sandpack } from "@codesandbox/sandpack-react";
import { githubLight, sandpackDark } from "@codesandbox/sandpack-themes";
/**
 * The only reason this is a separate import, is so
 * we don't need to make the full page 'use client', but only this copmponent.
 */
export const SandpackExamples = () => {
  return (
    <>
      <Sandpack />
      <Sandpack theme="dark" />
      <Sandpack theme={githubLight} template="nextjs" />
      <Sandpack options={{ readOnly: true }} theme={sandpackDark} />
    </>
  );
};
