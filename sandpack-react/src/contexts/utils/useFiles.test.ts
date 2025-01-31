/**
 * @jest-environment jsdom
 */
import type { SandpackBundlerFile } from "@codesandbox/sandpack-client/src";
import { renderHook, act } from "@testing-library/react";

import { VANILLA_TEMPLATE } from "../../templates";
import { getSandpackStateFromProps } from "../../utils/sandpackUtils";

import { useFiles } from "./useFiles";

describe(useFiles, () => {
  it("should returns an initial state, which is the default template", () => {
    const { result } = renderHook(() => useFiles({}));

    const stateFromDefaultTemplate = getSandpackStateFromProps({
      ...VANILLA_TEMPLATE,
      files: {},
    });

    expect(result.current[0]).toEqual({
      ...stateFromDefaultTemplate,
      shouldUpdatePreview: true,
      visibleFilesFromProps: stateFromDefaultTemplate.visibleFiles,
    });
  });

  it("adds a new file", () => {
    const { result } = renderHook(() => useFiles({}));

    act(() => {
      result.current[1].addFile("/App.js", "new-content");
    });

    expect(result.current[0].files["/App.js"].code).toBe("new-content");
  });

  it("deletes a file", () => {
    const { result } = renderHook(() => useFiles({}));

    const fileList = Object.keys(VANILLA_TEMPLATE.files);

    // Original list
    expect(Object.keys(result.current[0].files)).toEqual(fileList);

    act(() => {
      result.current[1].deleteFile("/src/index.js");
    });

    // New list without deleted file
    expect(result.current[0].files["/src/index.js"]).toBe(undefined);
    expect(Object.keys(result.current[0].files)).toEqual(
      fileList.filter((file) => file !== "/src/index.js")
    );
  });

  it("deletes the activeFile and set the following visibleFile as active", async () => {
    const { result } = renderHook(() =>
      useFiles({
        template: "react",
        options: { activeFile: "/App.js", visibleFiles: ["/styles.css"] },
      })
    );

    await act(async () => {
      result.current[1].deleteFile("/App.js");
    });

    expect(result.current[0].activeFile).toBe("/styles.css");
  });

  it("deletes the activeFile and set the entry file if there no visibleFile left", async () => {
    const { result } = renderHook(() =>
      useFiles({
        template: "react",
        options: { activeFile: "/App.js", visibleFiles: [] },
      })
    );

    await act(async () => {
      result.current[1].deleteFile("/App.js");
    });

    expect(result.current[0].activeFile).toBe("/package.json");
  });

  it("updates a file", () => {
    const { result } = renderHook(() => useFiles({ template: "react" }));

    expect(result.current[0].files["/App.js"]).toEqual({
      code: `export default function App() {
  return <h1>Hello world</h1>
}
`,
    });

    act(() => {
      result.current[1].updateFile("/App.js", "Foo");
    });

    expect(result.current[0].files["/App.js"]).toEqual({ code: `Foo` });
  });

  it("updates multiples files", () => {
    const { result } = renderHook(() => useFiles({ template: "react" }));

    act(() => {
      result.current[1].updateFile({ "/App.js": "Foo", "/index.js": "Baz" });
    });

    expect(result.current[0].files["/App.js"]).toEqual({ code: `Foo` });
    expect(result.current[0].files["/index.js"]).toEqual({ code: `Baz` });
  });

  it("updates multiples files in a row", () => {
    const { result } = renderHook(() => useFiles({ template: "react" }));

    act(() => {
      result.current[1].updateFile("/App.js", "Foo");
    });

    act(() => {
      result.current[1].updateFile("/index.js", "Baz");
    });

    expect(result.current[0].files["/App.js"]).toEqual({ code: `Foo` });
    expect(result.current[0].files["/index.js"]).toEqual({ code: `Baz` });
  });
  it("doesn't override the activeFile's metadata", () => {
    const { result } = renderHook(useFiles, {
      initialProps: {
        template: "react",
        files: {
          "/App.js": {
            code: "export default function App() { return <h1>Hello world</h1>}",
            readOnly: true,
            someOtherMetadata: "foo",
          } as SandpackBundlerFile,
        },
      },
    });

    act(() => {
      result.current[1].updateFile("/App.js", "console.log(10)");
    });
    expect(result.current[0].files["/App.js"]).toEqual({
      code: "console.log(10)",
      readOnly: true,
      someOtherMetadata: "foo",
    });
  });
});
