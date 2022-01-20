import { calculateNearestUniquePath } from "./stringUtils";

describe(calculateNearestUniquePath, () => {
  it("strips the leading slash from the root path", () => {
    expect(
      calculateNearestUniquePath("/index.js", [
        "/other/index.js",
        "/test/index.js",
      ])
    ).toBe("index.js");
  });

  it("supports nested paths", () => {
    expect(
      calculateNearestUniquePath("/test/index.js", [
        "/index.js",
        "/other/index.js",
        "/other/something/index.js",
      ])
    ).toBe("test/index.js");

    expect(
      calculateNearestUniquePath("/test/something/index.js", [
        "/index.js",
        "/other/index.js",
        "/other/something/index.js",
      ])
    ).toBe("test/something/index.js");
  });

  it("keeps path when same level and same name", () => {
    expect(
      calculateNearestUniquePath("/other/index.js", ["/test/index.js"])
    ).toBe("other/index.js");
  });

  it("adds a leading `..` when other open paths have the same fileName, but different paths", () => {
    expect(
      calculateNearestUniquePath("/test/something/index.js", [
        "/index.js",
        "/example/index.js",
        "/example/something/else/index.js",
      ])
    ).toBe("../something/index.js");
  });

  it("supports root paths", () => {
    expect(
      calculateNearestUniquePath("README.md", [".gitignore", ".eslintignore"])
    ).toBe("README.md");
  });
});
