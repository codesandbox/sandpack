import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";

export function Dashboard() {
  // Local
  /*
  return (
    <SandpackProvider
      sandbox={{
        environment: "static",
        files: {
          "/index.js": { code: "console.log('Hello World!');" },
          "/index.html": {
            code: '<!DOCTYPE html><html><head><script src="index.js"></script></head><body><h1>Hello World</h1></body></html>',
          },
        },
        entry: "./index.html",
      }}
    >
      <SandpackLayout style={{ "--sp-layout-height": "500px" }}>
        <SandpackFileExplorer />
        <SandpackCodeEditor closableTabs />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
  */
  // Persisted Sandbox
  /*
  return (
    <SandpackProvider
      onChange={(event) => {
        if (event.type === "update") {
          return fetch("/api/sandboxes/hqw3k9/fs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              path: event.path,
              content: event.content,
              shortid: event.metadata.shortid,
            }),
          }).then((res) =>
            res.ok
              ? console.log("Sandbox updated")
              : console.error("Error updating sandbox")
          );
        }
      }}
      sandbox={() => fetch(`/api/sandboxes/hqw3k9`).then((res) => res.json())}
    >
      <SandpackLayout style={{ "--sp-layout-height": "500px" }}>
        <SandpackFileExplorer />
        <SandpackCodeEditor closableTabs />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
*/
  // VM
  return (
    <SandpackProvider
      sandbox={() => fetch(`/api/sandboxes/qc7lnq`).then((res) => res.json())}
    >
      <SandpackLayout style={{ "--sp-layout-height": "500px" }}>
        <SandpackFileExplorer />
        <SandpackCodeEditor closableTabs />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
}
