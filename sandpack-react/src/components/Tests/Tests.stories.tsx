import { dracula } from "@codesandbox/sandpack-themes";
import * as React from "react";

import { SandpackProvider, SandpackLayout, SandpackCodeEditor } from "../..";

import { SandpackTests } from "./";

export default {
  title: "components/Testing",
};

const addTests = `import {add} from './add';

test('Root of file test', () => {
  expect(add(1, 2)).toBe(add(2, 1)); 
})

describe('extending expect', () => {
  describe('add', () => {
    test.skip('Skipped test', () => {
      expect(true).toBe(false);
    });

    test('Commutative Law of Addition', () => {
      expect(add(1, 2)).toBe(add(2, 1));
    });

    describe('Nested describe block', () => {
      test('1000 + 1 = 1001', () => {
        expect(add(1000, 1)).toBe(1001);
      });  

      describe('Double nested describe block', () => {
        test('10 + 1 = 11', () => {
          expect(add(10, 1)).toBe(11);
        });  
      });
    });
  });
});

describe('Sibling describe block', () => {
  test('1 + 1 = 2', () => {
    expect(add(1, 1)).toBe(2);
  });  
});

describe('Empty describe block', () => {});
`;

const subTests = `import {sub} from './sub';

describe('Subtract', () => {
  test('1 - 1 = 0', () => {
    expect(sub(1, 1)).toBe(0);
  });
});
`;

const slowTest = `describe('Slow describe', () => {
  test('Slow test', async () => {
    await new Promise(res => setTimeout(res, 2500));
    expect(true).toBe(false);
  });
});
`;

const failingTests = `describe('Failing describe', () => {
  test('Failing test', () => {
    expect(true).toBe(false);
  });
});
`;

const fileErrorTest = `describe('This describe function is missing =>', ()  {
  test('should never run due to file error', () => {
    expect(true).toBe(false);
  });
});
`;

const extendedTest = `describe('Jest-extended matchers are supported', () => {
  test('Without explicit import by using a hidden setup file', () => {
    expect(true).toBeTrue();
  });
});
`;

const add = "export const add = (a: number, b: number): number => a + b;";
const sub = "export const sub = (a: number, b: number): number => a - b;";

export const Light: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{ entry: "add.ts" }}
      files={{
        "/add.test.ts": addTests,
        "/add.ts": add,
        "/src/app/sub.ts": sub,
        "/src/app/sub.test.ts": subTests,
        "/failing.test.ts": failingTests,
      }}
      theme="light"
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showRunButton={false}
          style={{ height: "70vh" }}
          showLineNumbers
        />
        <SandpackTests />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const Dark: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{ entry: "add.ts" }}
      files={{
        "/add.test.ts": addTests,
        "/add.ts": add,
        "/src/app/sub.ts": sub,
        "/src/app/sub.test.ts": subTests,
        "/failing.test.ts": failingTests,
      }}
      theme="dark"
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showRunButton={false}
          style={{ height: "70vh" }}
          showLineNumbers
        />
        <SandpackTests />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const FileError: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{ entry: "entry.ts" }}
      files={{
        "/error.test.ts": fileErrorTest,
        "/entry.ts": {
          hidden: true,
          code: "",
        },
      }}
      theme={dracula}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showRunButton={false}
          style={{ height: "70vh" }}
          showLineNumbers
        />
        <SandpackTests />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const ExtendedExpect: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{
        entry: "entry.ts",
        dependencies: { "jest-extended": "*" },
      }}
      files={{
        "/setup.test.ts": {
          hidden: true,
          code: "import * as matchers from 'jest-extended';\nexpect.extend(matchers);",
        },
        "/extended.test.ts": extendedTest,
        "/entry.ts": {
          hidden: true,
          code: "",
        },
      }}
      theme={dracula}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showRunButton={false}
          style={{ height: "70vh" }}
          showLineNumbers
        />
        <SandpackTests />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const SlowTest: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{ entry: "add.ts" }}
      files={{
        "/slow.test.ts": slowTest,
        "/add.test.ts": addTests,
        "/add.ts": add,
        "/src/app/sub.ts": sub,
        "/src/app/sub.test.ts": subTests,
      }}
      theme={dracula}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showRunButton={false}
          style={{ height: "70vh" }}
          showLineNumbers
        />
        <SandpackTests />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const NoTests: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{ entry: "add.ts" }}
      files={{
        "/add.ts": add,
        "/src/app/sub.ts": sub,
      }}
      theme={dracula}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showRunButton={false}
          style={{ height: "70vh" }}
          showLineNumbers
        />
        <SandpackTests />
      </SandpackLayout>
    </SandpackProvider>
  );
};
