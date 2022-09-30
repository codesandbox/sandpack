/**
 * @jest-environment jsdom
 */
import React from "react";
import { create } from "react-test-renderer";

import { REACT_TEMPLATE } from "..";

import type { SandpackProviderClass } from "./sandpackContext";
import { SandpackProvider } from "./sandpackContext";

const createContext = (): SandpackProviderClass => {
  const root = create(<SandpackProvider template="react" />);
  const instance = root.getInstance();

  instance.runSandpack();

  return instance;
};

const getAmountOfListener = (
  instance: SandpackProviderClass,
  name = "client-id",
  ignoreGlobalListener = false
): number => {
  return (
    Object.keys(instance.clients[name].iframeProtocol.channelListeners).length -
    1 - // less protocol listener
    (ignoreGlobalListener ? 0 : 1) // less the global Sandpack-react listener
  );
};

describe(SandpackProvider, () => {
  describe("updateFile", () => {
    it("adds a file", () => {
      const instance = createContext();

      instance.addFile({ "new-file.js": "new-content" });

      expect(instance.state.files["/new-file.js"].code).toBe("new-content");
    });

    it("deletes a file", () => {
      const instance = createContext();

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
      const instance = createContext();

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
      const instance = createContext();

      instance.updateFile({ "/App.js": "Foo", "/index.js": "Baz" });

      expect(instance.state.files["/App.js"]).toEqual({ code: `Foo` });
      expect(instance.state.files["/index.js"]).toEqual({ code: `Baz` });
    });

    it("updates multiples files in a row", () => {
      const instance = createContext();

      instance.updateFile("/App.js", "Foo");
      instance.updateFile("/index.js", "Baz");

      expect(instance.state.files["/App.js"]).toEqual({ code: `Foo` });
      expect(instance.state.files["/index.js"]).toEqual({ code: `Baz` });
    });
  });

  describe("editorState", () => {
    it("should return the same initial state", () => {
      const instance = createContext();

      expect(instance.state.editorState).toBe("pristine");
    });

    it("should return a dirty value after updating a file", () => {
      const instance = createContext();

      expect(instance.state.editorState).toBe("pristine");

      instance.updateFile("/App.js", "Foo");
      expect(instance.state.editorState).toBe("dirty");
    });

    it("should return a pristine value after reseting files", () => {
      const instance = createContext();

      expect(instance.state.editorState).toBe("pristine");

      instance.updateFile("/App.js", "Foo");
      expect(instance.state.editorState).toBe("dirty");

      instance.resetAllFiles();
      expect(instance.state.editorState).toBe("pristine");
    });

    it("should return a pristine value after reverting a change", () => {
      const instance = createContext();
      expect(instance.state.editorState).toBe("pristine");

      instance.updateFile("/App.js", "Foo");
      expect(instance.state.editorState).toBe("dirty");

      instance.updateFile("/App.js", REACT_TEMPLATE["files"]["/App.js"].code);

      expect(instance.state.editorState).toBe("pristine");
    });
  });

  describe("listeners", () => {
    it("sets a listener, but the client hasn't been created yet - no global listener", () => {
      const instance = createContext();

      // Act: Add listener
      const mock = jest.fn();
      instance.addListener(mock, "client-id");

      // Act: Create client
      instance.registerBundler(document.createElement("iframe"), "client-id");

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(instance.unsubscribeClientListeners["client-id"]).length
      ).toBe(1);

      // Expect: no global listener
      expect(Object.keys(instance.queuedListeners.global).length).toBe(0);

      // Expect: one client
      expect(Object.keys(instance.clients)).toEqual(["client-id"]);

      /**
       * TODO: figure out how to mock SandpackClient and invoke the listener func
       */
      // expect(mock).toHaveBeenCalled();
    });

    it("sets a listener, but the client hasn't been created yet - global listener", () => {
      const instance = createContext();

      // Act: Add listener
      const mock = jest.fn();
      instance.addListener(mock /* , no client-id */);

      // Act: Create client
      instance.registerBundler(document.createElement("iframe"), "client-id");

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(instance.unsubscribeClientListeners["client-id"]).length
      ).toBe(1);

      // Expect: no global listener
      expect(Object.keys(instance.queuedListeners.global).length).toBe(1);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance)).toBe(1);
    });

    it("set a listener, but the client has already been created - no global listener", () => {
      const instance = createContext();

      // Act: Create client
      instance.registerBundler(document.createElement("iframe"), "client-id");

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(instance.unsubscribeClientListeners["client-id"]).length
      ).toBe(0);

      // Expect: no global listener
      expect(Object.keys(instance.queuedListeners.global).length).toBe(0);

      // Act: Add listener
      const mock = jest.fn();
      instance.addListener(mock, "client-id");

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(instance.unsubscribeClientListeners["client-id"]).length
      ).toBe(0);

      // Expect: no global listener
      expect(Object.keys(instance.queuedListeners.global).length).toBe(0);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance)).toBe(1);
    });

    it("set a listener, but the client has already been created - global listener", () => {
      const instance = createContext();

      // Act: Create client
      instance.registerBundler(document.createElement("iframe"), "client-id");

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(instance.unsubscribeClientListeners["client-id"]).length
      ).toBe(0);

      // Expect: no global listener
      expect(Object.keys(instance.queuedListeners.global).length).toBe(0);

      // Act: Add listener
      const mock = jest.fn();
      instance.addListener(mock /* , no client-id */);

      // Expect: no pending unsubscribe function, because it's a global
      expect(
        Object.keys(instance.unsubscribeClientListeners["client-id"]).length
      ).toBe(0);

      // Expect: one global listener
      expect(Object.keys(instance.queuedListeners.global).length).toBe(1);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance)).toBe(1);
    });

    it("sets a new listener, and then create one more client", () => {
      const instance = createContext();

      // Act: Add listener
      const mock = jest.fn();
      instance.addListener(mock, "client-id");

      // Act: Create client
      instance.registerBundler(document.createElement("iframe"), "client-id");

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(instance.unsubscribeClientListeners["client-id"]).length
      ).toBe(1);

      // Expect: no global listener
      expect(Object.keys(instance.queuedListeners.global).length).toBe(0);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance)).toBe(1);

      // Act: Add one more listener
      const anotherMock = jest.fn();
      instance.addListener(anotherMock /* , no client-id */);

      // Expect: one global listener
      expect(Object.keys(instance.queuedListeners.global).length).toBe(1);

      // Expect: two listener in the client
      expect(getAmountOfListener(instance)).toBe(2);
    });

    it("unsubscribes only from the assigned client id", () => {
      const instance = createContext();

      instance.registerBundler(document.createElement("iframe"), "client-1");
      instance.registerBundler(document.createElement("iframe"), "client-2");

      // Initial state
      expect(getAmountOfListener(instance, "client-1")).toBe(0);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(0);

      // Add listeners
      instance.addListener(jest.fn(), "client-1");
      const unsubscribeClientTwo = instance.addListener(jest.fn(), "client-2");

      expect(getAmountOfListener(instance, "client-1")).toBe(1);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(1);

      unsubscribeClientTwo();

      expect(getAmountOfListener(instance, "client-1")).toBe(1);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(0);
    });

    it("doesn't trigger global unsubscribe", () => {
      const instance = createContext();

      instance.registerBundler(document.createElement("iframe"), "client-1");
      instance.registerBundler(document.createElement("iframe"), "client-2");

      instance.addListener(jest.fn());
      instance.addListener(jest.fn());
      const unsubscribe = instance.addListener(jest.fn());

      expect(getAmountOfListener(instance, "client-1")).toBe(3);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(3);

      unsubscribe();

      expect(getAmountOfListener(instance, "client-1")).toBe(2);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(2);
    });

    it("unsubscribe all the listeners from a specific client when it unmonts", () => {
      const instance = createContext();

      instance.registerBundler(document.createElement("iframe"), "client-1");
      instance.registerBundler(document.createElement("iframe"), "client-2");

      instance.addListener(jest.fn());
      instance.addListener(jest.fn());
      instance.addListener(jest.fn());

      expect(getAmountOfListener(instance, "client-1")).toBe(3);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(3);

      instance.unregisterBundler("client-2");

      expect(getAmountOfListener(instance, "client-1")).toBe(3);
      expect(instance.clients["client-2"]).toBe(undefined);
    });
  });
});
