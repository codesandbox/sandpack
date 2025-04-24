import type * as sandpackEnv from "@codesandbox/sandpack-environments";
import React from "react";

import { useSandbox } from "../contexts/SandpackSandboxContext";

export function usePreview() {
  const previewRef = React.useRef<sandpackEnv.SandpackPreview | null>(null);
  const { environment: env } = useSandbox();

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
