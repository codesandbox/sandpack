import { REACT_TEMPLATE } from "../templates/react";

import {
  getSandpackStateFromProps,
  createSetupFromUserInput,
} from "./sandpackUtils";

describe("getSandpackStateFromProps", () => {
  test("always return an activeFile", () => {
    const template = getSandpackStateFromProps({ template: "react" });
    expect(template.activePath).toBe("/App.js");

    const noTemplate = getSandpackStateFromProps({});
    expect(noTemplate.activePath).toBe("/src/index.js");

    const customSetup = getSandpackStateFromProps({
      customSetup: { entry: "foo.js", files: { "foo.js": "" } },
    });
    expect(customSetup.activePath).toBe("foo.js");
  });

  test("exclude hidden files from template", () => {
    const output = getSandpackStateFromProps({ template: "react" });
    const collectFilenames = Object.entries(REACT_TEMPLATE.files).reduce(
      (acc, [key, value]) => {
        if (!value.hidden) {
          acc.push(key);
        }

        return acc;
      },
      [] as string[]
    );

    expect(output.openPaths.sort()).toEqual(collectFilenames.sort());
  });

  test("exclude hidden files from custom files", () => {
    const output = getSandpackStateFromProps({
      customSetup: {
        entry: "/App.js",
        files: {
          "/App.js": { code: "" },
          "/custom.js": { hidden: true, code: "" },
        },
      },
    });

    expect(output.openPaths.sort()).toEqual(["/App.js"]);
  });

  test("exclude hidden files from custom files & template", () => {
    const output = getSandpackStateFromProps({
      template: "react",
      customSetup: {
        files: {
          "/App.js": { code: "" },
          "/custom.js": { hidden: true, code: "" },
        },
      },
    });

    expect(output.openPaths.sort()).toEqual(["/App.js"]);
  });

  test("not allow to hidden the entry file", () => {
    try {
      getSandpackStateFromProps({
        customSetup: {
          entry: "/App.js",
          files: {
            "/App.js": { hidden: true, code: "" },
            "/custom.js": { hidden: true, code: "" },
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      expect(err.message).toEqual(
        "undefined was set as the active file but was not provided"
      );
    }
  });

  test("show files which are `hidden` & `active` at the same time", () => {
    const output = getSandpackStateFromProps({
      template: "react",
      customSetup: {
        files: {
          "/App.js": { hidden: true, active: true, code: "" },
          "/custom.js": { hidden: true, code: "" },
        },
      },
    });

    expect(output.openPaths.sort()).toEqual(["/App.js"]);
  });

  test("show `activePath` even when it's hidden", () => {
    const output = getSandpackStateFromProps({
      template: "react",
      activePath: "/App.js",
      customSetup: {
        files: {
          "/App.js": { hidden: true, code: "" },
          "/custom.js": { hidden: true, code: "" },
        },
      },
    });

    expect(output.activePath).toEqual("/App.js");
  });
});

describe("createSetupFromUserInput", () => {
  test("convert `files` to a key/value format", () => {
    const output = createSetupFromUserInput({ files: { "App.js": "" } });
    expect(output).toStrictEqual({ files: { "App.js": { code: "" } } });
  });

  test("supports custom properties", () => {
    const output = createSetupFromUserInput({
      environment: "create-react-app",
      files: { "App.js": "" },
    });
    expect(output).toStrictEqual({
      environment: "create-react-app",
      files: { "App.js": { code: "" } },
    });
  });
});
