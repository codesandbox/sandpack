/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react";

import { VANILLA_TEMPLATE } from "../../templates";
import { getSandpackStateFromProps } from "../../utils/sandpackUtils";

import { useAppState } from "./useAppState";

describe(useAppState, () => {
  it("should return the same initial state", () => {
    const props = { files: {} };
    const internalState = getSandpackStateFromProps(props);

    const { result } = renderHook(() =>
      useAppState(props, internalState.files)
    );

    expect(result.current.editorState).toBe("pristine");
  });

  it("should return a dirty value after updating a file", () => {
    const props = { files: {} };
    const internalState = getSandpackStateFromProps(props);

    const { result, rerender } = renderHook(
      (initialInternalState) => useAppState(props, initialInternalState.files),
      { initialProps: internalState }
    );
    expect(result.current.editorState).toBe("pristine");

    // Update internal state
    const newInternalState = getSandpackStateFromProps({
      ...internalState,
      files: { ...internalState.files, "/src/index.js": { code: "UPDATED" } },
    });
    rerender(newInternalState);

    expect(result.current.editorState).toBe("dirty");
  });

  it("should return a pristine value after reseting files", () => {
    const props = { files: {} };
    const internalState = getSandpackStateFromProps(props);

    const { result, rerender } = renderHook(
      (initialInternalState) => useAppState(props, initialInternalState.files),
      { initialProps: internalState }
    );
    expect(result.current.editorState).toBe("pristine");

    // Update internal state
    const newInternalState = getSandpackStateFromProps({
      ...internalState,
      files: { ...internalState.files, "/src/index.js": { code: "UPDATED" } },
    });
    rerender(newInternalState);

    expect(result.current.editorState).toBe("dirty");

    // Update to initial state
    rerender(internalState);
    expect(result.current.editorState).toBe("pristine");
  });

  it("should return a pristine value after reverting a change", () => {
    const props = { files: {} };
    const internalState = getSandpackStateFromProps(props);

    const { result, rerender } = renderHook(
      (initialInternalState) => useAppState(props, initialInternalState.files),
      { initialProps: internalState }
    );
    expect(result.current.editorState).toBe("pristine");

    // Update internal state
    const newInternalState = getSandpackStateFromProps({
      ...internalState,
      files: { ...internalState.files, "/index.js": { code: "UPDATED" } },
    });
    rerender(newInternalState);

    expect(result.current.editorState).toBe("dirty");

    // Update to initial state
    rerender(
      getSandpackStateFromProps({
        ...internalState,
        files: {
          ...internalState.files,
          "/index.js": {
            code: VANILLA_TEMPLATE["files"]["/index.js"].code,
          },
        },
      })
    );
    expect(result.current.editorState).toBe("pristine");
  });
});
