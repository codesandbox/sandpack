import { REACT_TEMPLATE } from "../templates/react";

import {
  getSandpackStateFromProps,
  createSetupFromUserInput,
  resolveFile,
} from "./sandpackUtils";

describe(resolveFile, () => {
  test("it resolves the file path based on the extension", () => {
    const data = resolveFile("/file.js", { "/file.ts": "" });

    expect(data).toBe("/file.ts");
  });

  test("it adds the leading slash and resolves the file path", () => {
    const data = resolveFile("file.js", { "/file.js": "" });

    expect(data).toBe("/file.js");
  });

  test("it resolves the file path without leading slash", () => {
    const data = resolveFile("file.ts", { "file.js": "" });

    expect(data).toBe("file.js");
  });

  test("it removes the leading slash and resolves the file path", () => {
    const data = resolveFile("/file.js", { "file.js": "" });

    expect(data).toBe("file.js");
  });

  test("it fixes (add/remove) the leading slash and fixes the extension", () => {
    const data = resolveFile("/file.ts", { "file.js": "" });

    expect(data).toBe("file.js");
  });
});

describe(getSandpackStateFromProps, () => {
  /**
   * activePath
   */
  test("it retuns the main file in case activePath doesn't exist", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      activePath: "NO_EXIST.js",
    });

    expect(setup.activePath).not.toBe("NO_EXIST.js");
    expect(setup.activePath).toBe(REACT_TEMPLATE.main);
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

  test("show activePath even when it's hidden", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      activePath: "/App.js",
      customSetup: {
        files: {
          "/App.js": { hidden: true, code: "" },
          "/custom.js": { hidden: true, code: "" },
        },
      },
    });

    expect(setup.activePath).toEqual("/App.js");
  });

  test("activePath overrides the customSetup.main", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      activePath: "/App.js",
      customSetup: {
        main: "/custom.js",
        files: {
          "/App.js": "",
          "/custom.js": "",
        },
      },
    });

    expect(setup.activePath).toEqual("/App.js");
  });

  /**
   * hidden file
   */
  test("exclude hidden files from template", () => {
    const setup = getSandpackStateFromProps({ template: "react" });
    const collectFilenames = Object.entries(REACT_TEMPLATE.files).reduce(
      (acc, [key, value]) => {
        if (!value.hidden) {
          acc.push(key);
        }

        return acc;
      },
      [] as string[]
    );

    expect(setup.openPaths.sort()).toEqual(collectFilenames.sort());
  });

  test("exclude hidden files from custom files", () => {
    const setup = getSandpackStateFromProps({
      customSetup: {
        entry: "/App.js",
        files: {
          "/App.js": { code: "" },
          "/custom.js": { hidden: true, code: "" },
        },
      },
    });

    expect(setup.openPaths.sort()).toEqual(["/App.js"]);
  });

  test("exclude hidden files from custom files & template", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      customSetup: {
        files: {
          "/App.js": { code: "" },
          "/custom.js": { hidden: true, code: "" },
        },
      },
    });

    expect(setup.openPaths.sort()).toEqual(["/App.js"]);
  });

  test("show files which are `hidden` & `active` at the same time", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      customSetup: {
        files: {
          "/App.js": { hidden: true, active: true, code: "" },
          "/custom.js": { hidden: true, code: "" },
        },
      },
    });

    expect(setup.openPaths.sort()).toEqual(["/App.js"]);
  });

  /**
   * entry file
   */
  test("it needs to provide a entry file, when template is omitted", () => {
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

  test("it updates the entry file in the package.json", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      customSetup: {
        entry: "foo.ts",
        files: { "foo.ts": "" },
      },
    });

    const packageContent = JSON.parse(setup.files["/package.json"].code);
    expect(packageContent.main).toBe("foo.ts");
  });

  test("it resolves the entry file, even when the extension is wrong", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      customSetup: {
        entry: "entry.ts",
        files: { "entry.js": "" },
      },
    });

    const packageContent = JSON.parse(setup.files["/package.json"].code);
    expect(packageContent.main).toBe("entry.js");
  });

  /**
   * openPaths
   */
  test("should not show invalid files into `openPaths`", () => {
    const output = getSandpackStateFromProps({
      template: "react",
      openPaths: ["/App.js", "not-exist.js"],
    });

    expect(output.openPaths).toEqual(["/App.js"]);
  });

  /**
   * main file
   */
  // TODO

  /**
   * dependencies
   */
  // TODO

  /**
   * environment
   */
  // TODO
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
