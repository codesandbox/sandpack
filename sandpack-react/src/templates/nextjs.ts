/**
 * @category Template
 */
export const NEXTJS_TEMPLATE = {
  files: {
    "/pages/index.js": {
      code: `export default function App() {
  return <h1>Hello World</h1>
}
`,
    },
  },
  dependencies: {
    react: "^18.0.0",
    next: "latest",
  },
  entry: "/pages/index.js",
  main: "/pages/index.js",
  environment: "nextjs",
};
