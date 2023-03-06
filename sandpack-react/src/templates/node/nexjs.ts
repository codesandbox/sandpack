import { commonFiles } from "../common";

export const NEXTJS_TEMPLATE = {
  files: {
    ...commonFiles,
    "/pages/_app.js": {
      code: `import '../styles.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}`,
    },
    "/pages/index.js": {
      code: `export default function Home({ data }) {
  return (
    <div>
      <h1>Hello {data}</h1>
    </div>
  );
}
  
export function getServerSideProps() {
  return {
    props: { data: "world" },
  }
}
`,
    },
    "/next.config.js": {
      code: `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
`,
    },
    "/package.json": {
      code: JSON.stringify({
        name: "my-app",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "NEXT_TELEMETRY_DISABLED=1 next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
        },
        dependencies: {
          next: "12.1.6", // @todo: update to the latest version
          react: "18.2.0",
          "react-dom": "18.2.0",
          "@next/swc-wasm-nodejs": "12.1.6",
        },
      }),
    },
  },
  main: "/pages/index.js",
  environment: "node",
};
