import { addPackageJSONIfNeeded, normalizePath } from "./utils";

const files = {
  "/package.json": {
    code: `{
  "name": "custom-package",
  "main": "old-entry.js",
  "dependencies": { "baz": "*" },
  "devDependencies": { "baz": "*" }
}`,
  },
};

describe(addPackageJSONIfNeeded, () => {
  test("it merges the package.json - dependencies", () => {
    const output = addPackageJSONIfNeeded(files, { foo: "*" });

    expect(JSON.parse(output["/package.json"].code).dependencies).toEqual({
      baz: "*",
      foo: "*",
    });
  });

  test("it merges the package.json - dev-dependencies", () => {
    const output = addPackageJSONIfNeeded(files, undefined, { foo: "*" });

    expect(JSON.parse(output["/package.json"].code).devDependencies).toEqual({
      baz: "*",
      foo: "*",
    });
  });

  test("it merges the package.json - entry", () => {
    const output = addPackageJSONIfNeeded(
      files,
      undefined,
      undefined,
      "new-entry.js"
    );

    expect(JSON.parse(output["/package.json"].code).main).toEqual(
      "new-entry.js"
    );
  });

  test("it set the entry file into package.json", () => {
    const output = addPackageJSONIfNeeded(
      {
        "/package.json": {
          code: `{
        "name": "custom-package",
        "dependencies": { "baz": "*" },
        "devDependencies": { "baz": "*" }
      }`,
        },
      },
      undefined,
      undefined,
      "new-entry.js"
    );

    expect(JSON.parse(output["/package.json"].code).main).toEqual(
      "new-entry.js"
    );
  });

  test("it returns an error when there is not dependencies at all", () => {
    try {
      addPackageJSONIfNeeded({ "/package.json": { code: `{}` } });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      expect(err.message).toBe(
        '[sandpack-client]: "dependencies" was not specified - provide either a package.json or a "dependencies" value'
      );
    }
  });

  test("it supports package.json without leading slash", () => {
    const output = addPackageJSONIfNeeded(
      {
        "package.json": {
          code: `{
  "dependencies": { "baz": "*" },
  "devDependencies": { "baz": "*" }
}`,
        },
      },
      { foo: "*" },
      { foo: "*" },
      "new-entry.ts"
    );

    expect(JSON.parse(output["/package.json"].code)).toEqual({
      main: "new-entry.ts",
      dependencies: { baz: "*", foo: "*" },
      devDependencies: { baz: "*", foo: "*" },
    });
  });
});

describe(normalizePath, () => {
  it("adds trailing slash to a string", () => {
    expect(normalizePath("foo")).toBe("/foo");
    expect(normalizePath("/foo")).toBe("/foo");
  });

  it("adds trailing slash to an array of string", () => {
    expect(normalizePath(["foo", "/baz"])).toStrictEqual(["/foo", "/baz"]);
    expect(normalizePath(["/foo", "/baz"])).toStrictEqual(["/foo", "/baz"]);
  });

  it("adds trailing slash to an object", () => {
    expect(normalizePath({ foo: "", baz: "" })).toStrictEqual({
      "/baz": "",
      "/foo": "",
    });
    expect(normalizePath({ "/foo": "", "/baz": "" })).toStrictEqual({
      "/baz": "",
      "/foo": "",
    });
  });

  it("doesn't tranform invalid values", () => {
    expect(normalizePath(undefined)).toBe(null);
    expect(normalizePath(null)).toBe(null);
    expect(normalizePath(123)).toBe(null);
  });
});
