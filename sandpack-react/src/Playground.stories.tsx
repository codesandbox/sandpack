/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { Sandpack } from "./";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  return (
    <div style={{ height: "400vh" }}>
      <Sandpack
        files={{
          "/App.js": `export default function TodoList() {
            return (
              // This doesn't quite work!
              <h1>Hedy Lamarr's Todos</h1>
              <img
                src="https://i.imgur.com/yXOvdOSs.jpg"
                alt="Hedy Lamarr"
                class="photo"
              >
              <ul>
                <li>Invent new traffic lights
                <li>Rehearse a movie scene
                <li>Improve spectrum technology
              </ul>
            );
          }
          `,
        }}
        options={{
          initMode: "user-visible",
          bundlerURL: "https://786946de.sandpack-bundler-4bw.pages.dev",
        }}
        template="react"
      />
    </div>
  );
};
