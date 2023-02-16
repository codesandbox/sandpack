export const TEST_TYPESCRIPT_TEMPLATE = {
  files: {
    "tsconfig.json": {
      code: `{
  "include": [
    "./**/*"
  ],
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "lib": [ "dom", "es2015" ],
    "jsx": "react-jsx"
  }
}`,
    },
    "/add.ts": {
      code: `export const add = (a: number, b: number): number => a + b;`,
    },
    "/add.test.ts": {
      code: `import { add } from './add';

describe('add', () => {
  test('Commutative Law of Addition', () => {
    expect(add(1, 2)).toBe(add(2, 1));
  });
});`,
    },
    "package.json": {
      code: JSON.stringify({
        dependencies: {},
        devDependencies: { typescript: "^4.0.0" },
        main: "/add.ts",
      }),
    },
  },
  main: "/add.test.ts",
  environment: "parcel",
  mode: "tests",
};
