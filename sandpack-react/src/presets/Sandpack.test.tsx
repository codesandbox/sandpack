/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import { renderToString } from "react-dom/server";

import { Sandpack } from "../";
import { editorClassName } from "../components/CodeEditor/styles";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.document = { self: window };

describe("Sandpack", () => {
  it("renders on a server without crashing", () => {
    const renderOnServer = (): string =>
      renderToString(<Sandpack options={{ id: "test" }} />);
    expect(renderOnServer).not.toThrow();
  });
});

describe("getSandpackCssText", () => {
  it.skip("should return only the essential style", () => {
    let sandpackModule = null;
    let renderToString = null;

    const componentClassName = editorClassName().className;

    jest.isolateModules(() => {
      sandpackModule = require("../");
      renderToString = require("react-dom/server").renderToString;
    });

    const { getSandpackCssText, SandpackProvider } = sandpackModule;

    renderToString(
      <SandpackProvider>
        <div />
      </SandpackProvider>
    );

    expect(getSandpackCssText().length).toBe(4600);
    expect(getSandpackCssText()).not.toContain(componentClassName);
  });

  it.skip("should return the essential style + the component style", () => {
    let sandpackModule = null;
    let renderToString = null;

    jest.isolateModules(() => {
      sandpackModule = require("../");
      renderToString = require("react-dom/server").renderToString;
    });

    const { SandpackProvider, SandpackCodeEditor, getSandpackCssText } =
      sandpackModule;

    const componentClassName = editorClassName().className;

    renderToString(
      <SandpackProvider>
        <SandpackCodeEditor />
      </SandpackProvider>
    );

    expect(getSandpackCssText()).toContain(componentClassName);
  });

  it.skip("should not duplicate the component CSS if there'is more than one component", () => {
    let sandpackModule = null;
    let renderToString = null;

    jest.isolateModules(() => {
      sandpackModule = require("../");
      renderToString = require("react-dom/server").renderToString;
    });

    const componentClassName = editorClassName().className;
    const { SandpackProvider, SandpackCodeEditor, getSandpackCssText } =
      sandpackModule;

    renderToString(
      <>
        <SandpackProvider>
          <SandpackCodeEditor />
          <SandpackCodeEditor />
        </SandpackProvider>

        <SandpackProvider>
          <SandpackCodeEditor />
        </SandpackProvider>
      </>
    );

    const selector = new RegExp(`${componentClassName}{`, "gm");
    expect(getSandpackCssText().match(selector).length).toBe(1);
  });

  it.skip("should not duplicate the CSS if two Sandpack has the same theme", () => {
    let sandpackModule = null;
    let renderToString = null;

    jest.isolateModules(() => {
      sandpackModule = require("../");
      renderToString = require("react-dom/server").renderToString;
    });

    const { Sandpack, getSandpackCssText } = sandpackModule;

    renderToString(
      <>
        <Sandpack theme="light" />
        <Sandpack theme="light" />
      </>
    );

    expect(getSandpackCssText()).toContain("--sxs{--sxs:0 light}");
    expect(getSandpackCssText().match(/--sp-colors-surface1:/g).length).toBe(1);
  });

  it.skip("should only include the new theme variables if a theme is different", () => {
    let sandpackModule = null;
    let renderToString = null;

    jest.isolateModules(() => {
      sandpackModule = require("../");
      renderToString = require("react-dom/server").renderToString;
    });

    const { Sandpack, getSandpackCssText } = sandpackModule;

    renderToString(
      <>
        <Sandpack theme="light" />
        <Sandpack theme="dark" />
      </>
    );

    expect(getSandpackCssText()).toContain("--sxs{--sxs:0 light dark}");
    expect(getSandpackCssText().match(/--sp-colors-surface1:/g).length).toBe(2);
  });
});
