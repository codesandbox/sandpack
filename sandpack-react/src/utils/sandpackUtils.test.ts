import { REACT_TEMPLATE } from "../templates/react";

import {
  getSandpackStateFromProps,
  createSetupFromUserInput,
  resolveFile,
} from "./sandpackUtils";

describe(resolveFile, () => {
  it("resolves the file path based on the extension", () => {
    const data = resolveFile("/file.js", { "/file.ts": "" });

    expect(data).toBe("/file.ts");
  });

  it("adds the leading slash and resolves the file path", () => {
    const data = resolveFile("file.js", { "/file.js": "" });

    expect(data).toBe("/file.js");
  });

  it("resolves the file path without leading slash", () => {
    const data = resolveFile("file.ts", { "file.js": "" });

    expect(data).toBe("file.js");
  });

  it("removes the leading slash and resolves the file path", () => {
    const data = resolveFile("/file.js", { "file.js": "" });

    expect(data).toBe("file.js");
  });

  it("fixes (add/remove) the leading slash and fixes the extension", () => {
    const data = resolveFile("/file.ts", { "file.js": "" });

    expect(data).toBe("file.js");
  });
});

describe(getSandpackStateFromProps, () => {
  /**
   * Files
   */
  test("it should merge template and files props", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      files: {
        "foo.ts": "foo",
      },
    });

    expect(setup.files["foo.ts"].code).toBe("foo");
  });

  test("files should override template files", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      files: {
        "/App.js": "foo",
      },
    });

    expect(setup.files["/App.js"].code).toBe("foo");
  });

  /**
   * activePath
   */
  test("it returns the main file in case activePath doesn't exist", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      options: {
        activePath: "NO_EXIST.js",
      },
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
      files: { "foo.js": "" },
      customSetup: { entry: "foo.js" },
    });
    expect(customSetup.activePath).toBe("foo.js");
  });

  test("show activePath even when it's hidden", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      options: {
        activePath: "/App.js",
      },
      files: {
        "/App.js": { hidden: true, code: "" },
        "/custom.js": { hidden: true, code: "" },
      },
    });

    expect(setup.activePath).toEqual("/App.js");
  });

  test("it uses entry as activePath", () => {
    const setup = getSandpackStateFromProps({
      files: { "entry.js": "" },
      customSetup: {
        entry: "entry.js",
      },
    });

    expect(setup.activePath).toEqual("entry.js");
  });

  /**
   * hidden file
   */
  test("exclude hidden files from template", () => {
    const setup = getSandpackStateFromProps({ template: "react" });
    const collectFilenames = Object.entries(REACT_TEMPLATE.files).reduce(
      (acc, [key, value]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(value as any).hidden) {
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
      files: {
        "/App.js": { code: "" },
        "/custom.js": { hidden: true, code: "" },
      },
      customSetup: {
        entry: "/App.js",
      },
    });

    expect(setup.openPaths.sort()).toEqual(["/App.js"]);
  });

  test("exclude hidden files from custom files & template", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      files: {
        "/App.js": { code: "" },
        "/custom.js": { hidden: true, code: "" },
      },
      customSetup: {},
    });

    expect(setup.openPaths.sort()).toEqual(["/App.js"]);
  });

  test("show files which are `hidden` & `active` at the same time", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      files: {
        "/App.js": { hidden: true, active: true, code: "" },
        "/custom.js": { hidden: true, code: "" },
      },
      customSetup: {},
    });

    expect(setup.openPaths.sort()).toEqual(["/App.js"]);
  });

  /**
   * Files - openPaths - activePath
   */
  test("openPaths override the files configurations", () => {
    const setup = getSandpackStateFromProps({
      files: {
        A: { hidden: true, code: "" },
        B: { hidden: true, code: "" },
      },
      customSetup: { entry: "A" },
      options: { openPaths: ["A", "B"] },
    });

    expect(setup.openPaths).toEqual(["A", "B"]);
  });

  test("activePath override the files configurations", () => {
    const setup = getSandpackStateFromProps({
      files: {
        A: { active: true, code: "" },
        B: { code: "" },
      },
      customSetup: { entry: "A" },
      options: { activePath: "B" },
    });

    expect(setup.activePath).toEqual("B");
  });

  /**
   * entry file
   */
  test("it updates the entry file in the package.json", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      files: { "foo.ts": "" },
      customSetup: {
        entry: "foo.ts",
      },
    });

    const packageContent = JSON.parse(setup.files["/package.json"].code);
    expect(packageContent.main).toBe("foo.ts");
  });

  test("it resolves the entry file, even when the extension is wrong", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      files: { "entry.js": "" },
      customSetup: {
        entry: "entry.ts",
      },
    });

    const packageContent = JSON.parse(setup.files["/package.json"].code);
    expect(packageContent.main).toBe("entry.js");
  });

  test("it keeps the entry into package.json main", () => {
    const setup = getSandpackStateFromProps({
      files: {
        "/package.json": `{ "main": "main-entry.ts" }`,
        "new-entry.js": "",
      },
      customSetup: { entry: "entry.js" },
    });

    const packageContent = JSON.parse(setup.files["/package.json"].code);
    expect(packageContent.main).toEqual("main-entry.ts");
  });

  test("it needs to set the entry into package.json as main", () => {
    const setup = getSandpackStateFromProps({
      files: {
        "/package.json": `{}`,
        "entry.js": "",
      },
      customSetup: { entry: "entry.js" },
    });

    const packageContent = JSON.parse(setup.files["/package.json"].code);
    expect(packageContent.main).toEqual("entry.js");
  });

  /**
   * openPaths
   */
  test("should not show invalid files into `openPaths`", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      options: {
        openPaths: ["/App.js", "not-exist.js"],
      },
    });

    expect(setup.openPaths).toEqual(["/App.js"]);
  });

  /**
   * dependencies
   */
  test("it creates a package.json with the dependencies", () => {
    const setup = getSandpackStateFromProps({
      files: { "index.js": "" },
      customSetup: {
        entry: "index.js",
        dependencies: { foo: "*" },
      },
    });

    const packageContent = JSON.parse(setup.files["/package.json"].code);
    expect(packageContent.dependencies).toEqual({ foo: "*" });
  });

  test("it defatuls to a package.json", () => {
    const setup = getSandpackStateFromProps({
      files: { "index.js": "" },
      customSetup: { entry: "index.js" },
    });

    const packageContent = JSON.parse(setup.files["/package.json"].code);
    expect(packageContent.dependencies).toEqual({});
  });

  test("it merges the dependencies into package.json dependencies", () => {
    const setup = getSandpackStateFromProps({
      files: { "/package.json": `{ "dependencies": { "baz": "*" } }` },
      customSetup: { dependencies: { foo: "*" } },
    });

    const packageContent = JSON.parse(setup.files["/package.json"].code);
    expect(packageContent.dependencies).toEqual({ foo: "*", baz: "*" });
  });

  test("it merges the dependencies from template into the package.json dependencies", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      customSetup: { dependencies: { foo: "*" } },
    });

    const packageContent = JSON.parse(setup.files["/package.json"].code);
    expect(packageContent.dependencies).toEqual({
      foo: "*",
      react: "^17.0.0",
      "react-dom": "^17.0.0",
      "react-scripts": "^4.0.0",
    });
  });

  /**
   * environment
   */
  test("environment default to parcel", () => {
    const setup = getSandpackStateFromProps({});

    expect(setup.environment).toBe("parcel");
  });

  test("environment default to the custom template environment", () => {
    const setup = getSandpackStateFromProps({ template: "svelte" });

    expect(setup.environment).toBe("svelte");
  });

  /**
   * Errors handling
   */
  test("it needs to provide a entry file, when template is omitted", () => {
    try {
      getSandpackStateFromProps({
        files: {
          "/App.js": { hidden: true, code: "" },
          "/custom.js": { hidden: true, code: "" },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      expect(err.message).toEqual(
        `[sandpack-client]: "entry" was not specified - provide either a package.json with the "main" field or na "entry" value`
      );
    }
  });

  test("it needs to provide whether template or files", () => {
    try {
      getSandpackStateFromProps({
        customSetup: {},
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      expect(err.message).toEqual(
        "[sandpack-react]: without a template, you must pass at least one file"
      );
    }
  });

  test("it throws an error when the given template doesn't exist", () => {
    try {
      getSandpackStateFromProps({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        template: "WHATEVER",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      expect(err.message).toEqual(
        `[sandpack-react]: invalid template "WHATEVER" provided`
      );
    }
  });
});

describe(createSetupFromUserInput, () => {
  test("convert `files` to a key/value format", () => {
    const setup = createSetupFromUserInput({ files: { "App.js": "" } });

    expect(setup).toStrictEqual({ files: { "App.js": { code: "" } } });
  });

  test("supports custom properties", () => {
    const setup = createSetupFromUserInput({
      files: { "App.js": "" },
      customSetup: { environment: "create-react-app" },
    });

    expect(setup).toStrictEqual({
      environment: "create-react-app",
      files: { "App.js": { code: "" } },
    });
  });
});
