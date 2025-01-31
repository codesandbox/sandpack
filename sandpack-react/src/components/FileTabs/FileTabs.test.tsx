/**
 * @jest-environment jsdom
 */
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackCodeEditor } from "../CodeEditor";

describe("FileTabs", () => {
  jest.useFakeTimers();

  it("doesn't have duplicate filename", () => {
    render(
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
    );

    act(() => {
      jest.runAllTimers();
    });

    const buttons = screen.getAllByRole("tab");
    const buttonsTex = buttons.map((item) => item.textContent);

    expect(buttonsTex).toEqual(["foo/App.js", "App.js", "baz/App.js"]);
  });

  it("render the visible files", () => {
    render(
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
    );

    act(() => {
      jest.runAllTimers();
    });

    const buttons = screen.getAllByRole("tab");
    const buttonsTex = buttons.map((item) => item.textContent);

    expect(buttonsTex).toEqual(["baz/App.js", "App.js"]);
  });
});
