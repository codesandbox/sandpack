/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { Sandpack } from "./";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  return <Sandpack template="nextjs" />;
};
