import { dracula } from "@codesandbox/sandpack-themes";
import * as themes from "@codesandbox/sandpack-themes";
import type { CSSProperties } from "@stitches/core";
import * as React from "react";

import { SandpackProvider, SandpackLayout, SandpackCodeEditor } from "../..";

import { SandpackTests } from "./";

export default {
  title: "components/Tests",
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

export const Main: React.FC = () => {
  const [theme, setTheme] = React.useState("dark");
  return (
    <div style={{ width: 800 }}>
      <SandpackProvider
        customSetup={{ entry: "add.ts" }}
        files={{
          "/add.test.ts": addTests,
          "/add.ts": add,
          "/src/app/sub.ts": sub,
          "/src/app/sub.test.ts": subTests,
          "/failing.test.ts": failingTests,
        }}
        theme={themes[theme] ?? theme}
      >
        <SandpackLayout
          style={{ "--sp-layout-height": "350px" } as CSSProperties}
        >
          <SandpackCodeEditor showRunButton={false} showLineNumbers />
          <SandpackTests />
        </SandpackLayout>
      </SandpackProvider>

      <h3>Themes</h3>
      <select onChange={({ target }): void => setTheme(target.value)}>
        <option value="auto">Auto</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        {Object.keys(themes).map((tem) => (
          <option value={tem}>{tem}</option>
        ))}
      </select>
    </div>
  );
};

export const VerboseMode: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{ entry: "add.ts" }}
      files={{
        "/add.test.ts": addTests,
        "/add.ts": add,
        "/src/app/sub.ts": sub,
        "/src/app/sub.test.ts": subTests,
      }}
      theme={dracula}
    >
      <SandpackLayout style={{ "--sp-layout-height": "70vh" } as CSSProperties}>
        <SandpackCodeEditor showRunButton={false} showLineNumbers />
        <SandpackTests verbose />
      </SandpackLayout>
    </SandpackProvider>
  );
};

/**
 * This story is used to test the `hideTestsAndSupressLogs` prop.
 * Tests content should not be visible in the tests console.
 * It is useful when you want to hide the tests from the user.
 *
 */
export const HiddenTests: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{ entry: "add.ts" }}
      files={{
        "/add.test.ts": addTests,
        "/add.ts": add,
        "/src/app/sub.ts": sub,
        "/src/app/sub.test.ts": subTests,
      }}
      options={{
        visibleFiles: ["/add.ts"],
      }}
      theme={dracula}
    >
      <SandpackLayout style={{ "--sp-layout-height": "70vh" } as CSSProperties}>
        <SandpackCodeEditor showRunButton={false} showLineNumbers />
        <SandpackTests hideTestsAndSupressLogs />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const OneTestFile: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{ entry: "sub.ts" }}
      files={{
        "/sub.ts": sub,
        "/sub.test.ts": subTests,
      }}
      theme={dracula}
    >
      <SandpackLayout style={{ "--sp-layout-height": "70vh" } as CSSProperties}>
        <SandpackCodeEditor showRunButton={false} showLineNumbers />
        <SandpackTests verbose />
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
      <SandpackLayout style={{ "--sp-layout-height": "70vh" } as CSSProperties}>
        <SandpackCodeEditor showRunButton={false} showLineNumbers />
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
      <SandpackLayout style={{ "--sp-layout-height": "70vh" } as CSSProperties}>
        <SandpackCodeEditor showRunButton={false} showLineNumbers />
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
        "/slow2.test.ts": slowTest,
        "/add.ts": add,
        "/src/app/sub.ts": sub,
        "/src/app/sub.test.ts": subTests,
      }}
      theme={dracula}
    >
      <SandpackLayout style={{ "--sp-layout-height": "70vh" } as CSSProperties}>
        <SandpackCodeEditor showRunButton={false} showLineNumbers />
        <SandpackTests verbose />
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
      <SandpackLayout style={{ "--sp-layout-height": "70vh" } as CSSProperties}>
        <SandpackCodeEditor showRunButton={false} showLineNumbers />
        <SandpackTests />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const OnCompleteHandler: React.FC = () => {
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
    >
      <SandpackLayout style={{ "--sp-layout-height": "70vh" } as CSSProperties}>
        <SandpackCodeEditor showRunButton={false} showLineNumbers />
        {/* eslint-disable-next-line no-console */}
        <SandpackTests onComplete={(specs): void => console.log(specs)} />
      </SandpackLayout>
    </SandpackProvider>
  );
};
