/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import React from "react";

import { Sandpack } from "./";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  return new Array(10).fill(null).map((_, index) => (
    <Sandpack
      options={{
        initMode: "user-visible",
      }}
      template="react"
    />
  ));
};
