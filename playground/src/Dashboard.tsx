import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";

export function Dashboard() {
  return (
    <SandpackProvider
      onChange={() => {}}
      sandbox={() => fetch(`/api/sandboxes/qc7lnq`).then((res) => res.json())}
      // sandboxId: "hqw3k9",
      // sandboxId: "qc7lnq",
    >
      <SandpackLayout style={{ "--sp-layout-height": "500px" }}>
        <SandpackFileExplorer />
        <SandpackCodeEditor closableTabs />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
}
