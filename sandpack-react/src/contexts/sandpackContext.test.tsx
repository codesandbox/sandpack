import React from "react";
import { create } from "react-test-renderer";

import { REACT_TEMPLATE } from "..";

import { SandpackProvider } from "./sandpackContext";

describe(SandpackProvider, () => {
  describe("updateFile", () => {
    it("adds a file", () => {
      const root = create(<SandpackProvider template="react" />);
      const instance = root.getInstance();

      instance.addFile({ "new-file.js": "new-content" });

      expect(instance.state.files["new-file.js"].code).toBe("new-content");
    });

    it("deletes a file", () => {
      const root = create(<SandpackProvider template="react" />);
      const instance = root.getInstance();

      instance.deleteFile("/App.js");

      expect(instance.state.files["/App.js"]).toBe(undefined);
      expect(Object.keys(instance.state.files)).toEqual([
        "/index.js",
        "/styles.css",
        "/public/index.html",
        "/package.json",
      ]);
    });

    it("updates a file", () => {
      const root = create(<SandpackProvider template="react" />);
      const instance = root.getInstance();

      expect(instance.state.files["/App.js"]).toEqual({
        code: `export default function App() {
  return <h1>Hello World</h1>
}
`,
      });

      instance.updateFile("/App.js", "Foo");

      expect(instance.state.files["/App.js"]).toEqual({ code: `Foo` });
    });

    it("updates multiples files", () => {
      const root = create(<SandpackProvider template="react" />);
      const instance = root.getInstance();

      instance.updateFile({ "/App.js": "Foo", "/index.js": "Baz" });

      expect(instance.state.files["/App.js"]).toEqual({ code: `Foo` });
      expect(instance.state.files["/index.js"]).toEqual({ code: `Baz` });
    });

    it("updates multiples files in a row", () => {
      const root = create(<SandpackProvider template="react" />);
      const instance = root.getInstance();

      instance.updateFile("/App.js", "Foo");
      instance.updateFile("/index.js", "Baz");

      expect(instance.state.files["/App.js"]).toEqual({ code: `Foo` });
      expect(instance.state.files["/index.js"]).toEqual({ code: `Baz` });
    });
  });

  describe("editorState", () => {
    it("should return the same initial state", () => {
      const root = create(<SandpackProvider template="react" />);
      const instance = root.getInstance();

      expect(instance.state.editorState).toBe("pristine");
    });

    it("should return a dirty value after updating a file", () => {
      const root = create(<SandpackProvider template="react" />);
      const instance = root.getInstance();

      expect(instance.state.editorState).toBe("pristine");

      instance.updateFile("/App.js", "Foo");
      expect(instance.state.editorState).toBe("dirty");
    });

    it("should return a pristine value after reseting files", () => {
      const root = create(<SandpackProvider template="react" />);
      const instance = root.getInstance();

      expect(instance.state.editorState).toBe("pristine");

      instance.updateFile("/App.js", "Foo");
      expect(instance.state.editorState).toBe("dirty");

      instance.resetAllFiles();
      expect(instance.state.editorState).toBe("pristine");
    });

    it("should return a pristine value after reverting a change", () => {
      const root = create(<SandpackProvider template="react" />);
      const instance = root.getInstance();
      expect(instance.state.editorState).toBe("pristine");

      instance.updateFile("/App.js", "Foo");
      expect(instance.state.editorState).toBe("dirty");

      instance.updateFile("/App.js", REACT_TEMPLATE["files"]["/App.js"].code);

      expect(instance.state.editorState).toBe("pristine");
    });
  });
});
