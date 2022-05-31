import React from "react";
import { create } from "react-test-renderer";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackCodeEditor } from "../CodeEditor";

describe("FileTabs", () => {
  it("doesn't have duplicate filename", () => {
    const component = create(
      <SandpackProvider
        files={{
          "/foo/App.js": "",
          "/App.js": "",
          "/baz/App.js": "",
        }}
        template="react"
      >
        <SandpackCodeEditor />
      </SandpackProvider>
    ).root;

    const buttons = component.findAll((el) =>
      el.props.className?.includes("sp-tab-button")
    );
    const buttonsTex = buttons.map((item) => item.props.children[0]);

    expect(buttonsTex).toEqual(["foo/App.js", "App.js", "baz/App.js"]);
  });
});
