/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import React from "react";

import { Sandpack } from "./presets";

export const Basic: React.FC = () => {
  return (
    <Sandpack
      options={{ classes: { "sp-layout": "fooo" } }}
      template="nextjs"
      theme={themes.sandpackDark}
    />
  );
};
