import type { ModuleListProps } from "./ModuleList";
import { fromPropsToModules } from "./utils";

const defaultProps: ModuleListProps = {
  files: {
    "/src/component/index.js": { code: "", hidden: true },
    "/src/folder/index.js": { code: "", hidden: true },
    "/component/index.js": { code: "", hidden: true },
    "/component/src/index.js": { code: "", hidden: true },
    "/hidden-folder/index.js": { code: "", hidden: true },
    "/non-hidden-folder/index.js": { code: "", hidden: false },
    "/index.js": { code: "", hidden: true },
    "/App.js": { code: "", hidden: false },
  },
  autoHiddenFiles: false,
  visibleFiles: [],
  prefixedPath: "/",
  activeFile: "",
  selectFile: () => {
    //
  },
};

describe(fromPropsToModules, () => {
  it("returns a list of unique folder", () => {
    expect(fromPropsToModules(defaultProps).directories).toEqual([
      "/src/",
      "/component/",
      "/hidden-folder/",
      "/non-hidden-folder/",
    ]);
  });

  it("returns only the root files", () => {
    expect(fromPropsToModules(defaultProps).modules).toEqual([
      "/index.js",
      "/App.js",
    ]);
  });

  it("returns the folder from a subfolder", () => {
    const input: ModuleListProps = {
      ...defaultProps,
      prefixedPath: "/src/",
    };

    expect(fromPropsToModules(input).directories).toEqual([
      "/src/component/",
      "/src/folder/",
    ]);
  });

  it("returns only the files from the visibleFiles prop (autoHiddenFiles)", () => {
    const input: ModuleListProps = {
      ...defaultProps,
      autoHiddenFiles: true,
      visibleFiles: ["/index.js", "/src/component/index.js"],
    };

    expect(fromPropsToModules(input)).toEqual({
      directories: ["/src/"],
      modules: ["/index.js"],
    });
  });

  it("returns only the non-hidden files (autoHiddenFiles)", () => {
    const input: ModuleListProps = {
      ...defaultProps,
      autoHiddenFiles: true,
      visibleFiles: [],
    };

    expect(fromPropsToModules(input)).toEqual({
      directories: ["/non-hidden-folder/"],
      modules: ["/App.js"],
    });
  });
});
