import { useEffect, useState } from "react";

import {
  Sandpack,
  SandpackPreview,
  SandpackProvider,
  SandpackLayout,
} from "../";
import { LoadingOverlay, SandpackStack } from "../common";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000);
  }, []);

  return (
    <>
      <SandpackProvider initMode="user-visible">
        <SandpackLayout>
          <SandpackStack>
            <div className="sp-preview-container">
              <LoadingOverlay loading={loading} />
            </div>
            <SandpackPreview />
          </SandpackStack>
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};
