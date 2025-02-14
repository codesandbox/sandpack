/**
 * @jest-environment jsdom
 */
import { REACT_TEMPLATE } from "../templates/runtime/react";

import {
  getSandpackStateFromProps,
  resolveFile,
  convertedFilesToBundlerFiles,
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
    const data = resolveFile("file.ts", { "/file.js": "" });

    expect(data).toBe("/file.js");
  });

  it("removes the leading slash and resolves the file path", () => {
    const data = resolveFile("file.js", { "/file.js": "" });

    expect(data).toBe("/file.js");
  });

  it("fixes (add/remove) the leading slash and fixes the extension", () => {
    const data = resolveFile("/file.ts", { "/file.js": "" });

    expect(data).toBe("/file.js");
  });

  it("resolves a file regardless the file extension", () => {
    const data = resolveFile("file.sh", { "/file.sh": "" });

    expect(data).toBe("/file.sh");
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

    expect(setup.files["/foo.ts"].code).toBe("foo");
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

  test("files should override template files regardless the leading slash", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      files: {
        "App.js": "foo",
      },
    });

    expect(setup.files["/App.js"].code).toBe("foo");
  });

  /**
   * activeFile
   */
  test("it returns the main file in case activeFile doesn't exist", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      options: {
        activeFile: "NO_EXIST.js",
      },
    });

    expect(setup.activeFile).not.toBe("NO_EXIST.js");
    expect(setup.activeFile).toBe(REACT_TEMPLATE.main);
  });

  test("always return an activeFile", () => {
    const template = getSandpackStateFromProps({ template: "react" });
    expect(template.activeFile).toBe("/App.js");

    const noTemplate = getSandpackStateFromProps({});
    expect(noTemplate.activeFile).toBe("/index.js");

    const customSetup = getSandpackStateFromProps({
      files: { "foo.js": "" },
      customSetup: { entry: "foo.js" },
    });
    expect(customSetup.activeFile).toBe("/foo.js");
  });

  test("show activeFile even when it's hidden", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      options: {
        activeFile: "/App.js",
      },
      files: {
        "/App.js": { hidden: true, code: "" },
        "/custom.js": { hidden: true, code: "" },
      },
    });

    expect(setup.activeFile).toEqual("/App.js");
  });

  test("it uses entry as activeFile", () => {
    const setup = getSandpackStateFromProps({
      files: { "entry.js": "" },
      customSetup: {
        entry: "entry.js",
      },
    });

    expect(setup.activeFile).toEqual("/entry.js");
  });

  test("custom activeFile", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      options: {
        activeFile: "/index.js",
      },
    });

    expect(setup.activeFile).toBe("/index.js");
  });

  /**
   * hidden file
   */
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

    expect(setup.visibleFiles.sort()).toEqual(["/App.js"]);
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

    expect(setup.visibleFiles.sort()).toEqual(["/App.js"]);
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

    expect(setup.visibleFiles.sort()).toEqual(["/App.js"]);
  });

  /**
   * Files - visibleFiles - activeFile
   */
  test("only the main file is visible in a default setup", () => {
    const setup = getSandpackStateFromProps({ template: "react" });

    expect(setup.visibleFiles.sort()).toEqual([REACT_TEMPLATE.main]);
  });

  test("it uses the visible path prop properly with a default template", () => {
    const setup = getSandpackStateFromProps({
      options: { visibleFiles: ["/styles.css"] },
    });

    expect(setup.visibleFiles.sort()).toEqual(["/index.js", "/styles.css"]);
  });

  test("it uses the visible path prop properly with a template", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      options: { visibleFiles: ["/styles.css"] },
    });

    expect(setup.visibleFiles.sort()).toEqual(["/App.js", "/styles.css"]);
  });

  test("visibleFiles override the files configurations", () => {
    const setup = getSandpackStateFromProps({
      files: {
        "A.js": { hidden: true, code: "" },
        "B.js": { hidden: true, code: "" },
      },
      customSetup: { entry: "A" },
      options: { visibleFiles: ["A.js", "B.js"] },
    });

    expect(setup.visibleFiles).toEqual(["/A.js", "/B.js"]);
  });

  test("activeFile override the files configurations", () => {
    const setup = getSandpackStateFromProps({
      files: {
        "A.js": { active: true, code: "" },
        "B.js": { code: "" },
      },
      customSetup: { entry: "A" },
      options: { activeFile: "B" },
    });

    expect(setup.activeFile).toEqual("/B.js");
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
    expect(packageContent.main).toBe("/foo.ts");
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
    expect(packageContent.main).toBe("/entry.js");
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
    expect(packageContent.main).toEqual("/entry.js");
  });

  /**
   * visibleFiles
   */
  test("should not show invalid files into `visibleFiles`", () => {
    const setup = getSandpackStateFromProps({
      template: "react",
      options: {
        visibleFiles: ["/App.js", "not-exist.js"],
      },
    });

    expect(setup.visibleFiles).toEqual(["/App.js"]);
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
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "react-scripts": "^5.0.0",
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

describe(convertedFilesToBundlerFiles, () => {
  it("converts regular files to bundler files", () => {
    expect(convertedFilesToBundlerFiles({ name: "code" })).toEqual({
      name: { code: "code" },
    });
  });

  it("keeps bundler files original", () => {
    expect(
      convertedFilesToBundlerFiles({ name: { code: "code", hidden: true } })
    ).toEqual({
      name: { code: "code", hidden: true },
    });
  });
});
