/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import React from "react";

import { Sandpack } from "./presets";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  return (
    <>
      <Sandpack template="nextjs" theme={themes.sandpackDark} />
    </>
  );
};
