import { Sandpack } from "@codesandbox/sandpack-react";

const PageNotFound: React.FC = () => {
  return (
    <div>
      <div style={{ maxWidth: 1000, margin: "auto" }}>
        <h1 className="nx-font-semibold nx-tracking-tight nx-mt-10 nx-pb-1 nx-text-3xl contrast-more:nx-border-neutral-400 ">
          Page not found
        </h1>

        <div className="theme-doc-markdown markdown nx-mt-2 nx-mb-8">
          <p>Oops! We can't find this page.</p>
        </div>

        <Sandpack
          files={{
            "App.js": `export default function App() {
  return <Page />
}
`,
          }}
          template="react"
        />
      </div>
    </div>
  );
};

export default PageNotFound;
