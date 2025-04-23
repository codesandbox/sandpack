import type * as sandpackEnv from "@codesandbox/sandpack-environments";
import React from "react";

import { useEnvironment } from "../contexts/SandpackEnvironmentContext";

export function usePreview() {
  const previewRef = React.useRef<sandpackEnv.SandpackPreview | null>(null);
  const env = useEnvironment();

  if (!previewRef.current) {
    previewRef.current = env.createPreview();
  }

  const preview = previewRef.current;

  React.useSyncExternalStore(
    (update) => preview.onStatusChange(update),
    () => preview.status
  );

  return preview;
}
