/**
 * @jest-environment jsdom
 */
import { act } from "@testing-library/react-hooks";
import React from "react";
import { create } from "react-test-renderer";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackCodeEditor } from "../CodeEditor";

describe("FileTabs", () => {
  jest.useFakeTimers();

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

    act(() => {
      jest.runAllTimers();
    });

    const buttons = component.findAll((el) =>
      el.props.className?.includes("sp-tab-button")
    );
    const buttonsTex = buttons.map((item) => item.props.children[0]);

    expect(buttonsTex).toEqual(["foo/App.js", "App.js", "baz/App.js"]);
  });

  it("render the visible files", () => {
    const component = create(
      <SandpackProvider
        files={{
          "/foo/App.js": "",
          "/App.js": "",
          "/baz/App.js": "",
        }}
        options={{
          visibleFiles: ["/baz/App.js", "/App.js"],
        }}
        template="react"
      >
        <SandpackCodeEditor />
      </SandpackProvider>
    ).root;

    act(() => {
      jest.runAllTimers();
    });

    const buttons = component.findAll((el) =>
      el.props.className?.includes("sp-tab-button")
    );
    const buttonsTex = buttons.map((item) => item.props.children[0]);

    expect(buttonsTex).toEqual(["baz/App.js", "App.js"]);
  });
});
