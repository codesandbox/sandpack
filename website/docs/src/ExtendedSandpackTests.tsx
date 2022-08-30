import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackTests,
} from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import React from "react";

const extendedTest = `import * as matchers from 'jest-extended';
import { add } from './add';

expect.extend(matchers);

describe('jest-extended matchers are supported', () => {
  test('adding two positive integers yields a positive integer', () => {
    expect(add(1, 2)).toBePositive();
  });
});
`;

export const ExtendedSandpackTests: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{
        dependencies: { "jest-extended": "^3.0.2" },
      }}
      files={{
        "/extended.test.ts": extendedTest,
      }}
      options={{
        activeFile: "/extended.test.ts",
        visibleFiles: ["/add.test.ts"],
      }}
      template="test-ts"
      theme={sandpackDark}
    >
      <SandpackLayout>
        <SandpackCodeEditor showRunButton={false} showTabs />
        <SandpackTests verbose />
      </SandpackLayout>
    </SandpackProvider>
  );
};
