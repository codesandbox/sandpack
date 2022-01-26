import { REACT_TEMPLATE } from "../templates/react";

import {
  getSandpackStateFromProps,
  createSetupFromUserInput,
  resolveFile,
} from "./sandpackUtils";

describe(resolveFile, () => {
  test("it finds the file based on the extension", () => {
    const data = resolveFile("/file.js", { "/file.ts": "" });

    expect(data).toBe("/file.ts");
  });

  test("it adds the leading slash and find the file", () => {
    const data = resolveFile("file.js", { "/file.js": "" });

    expect(data).toBe("/file.js");
  });

  test("it removes the leading slash and find the file", () => {
    const data = resolveFile("/file.js", { "file.js": "" });

    expect(data).toBe("file.js");
  });
});

describe(getSandpackStateFromProps, () => {
  test("it retuns the main file in case activePath doesn't exist", () => {
    const data = getSandpackStateFromProps({
      template: "react",
      activePath: "NO_EXIST.js",
    });

    expect(data.activePath).not.toBe("NO_EXIST.js");
    expect(data.activePath).toBe(REACT_TEMPLATE.main);
  });

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

  test("it needs to provide a entry file", () => {
    try {
      getSandpackStateFromProps({
        customSetup: {
          files: {
            "/App.js": { hidden: true, code: "" },
            "/custom.js": { hidden: true, code: "" },
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      expect(err.message).toEqual(
        "Missing 'entry' parameter. Either specify an entry point, or pass in a package.json with the 'main' field set."
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

  test("should not show invalid files into `openPaths`", () => {
    const output = getSandpackStateFromProps({
      template: "react",
      openPaths: ["/App.js", "not-exist.js"],
    });

    expect(output.openPaths).toEqual(["/App.js"]);
  });
});

describe(createSetupFromUserInput, () => {
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
