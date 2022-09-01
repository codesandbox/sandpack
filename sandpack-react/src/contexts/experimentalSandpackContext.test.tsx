/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import React from "react";

import type { UseSandpack } from "..";
import { REACT_TEMPLATE, useSandpack } from "..";

import { ExperimentalSandpackProvider } from "./experimentalSandpackContext";

const createContext = (): UseSandpack => {
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ExperimentalSandpackProvider template="react">
      {children}
    </ExperimentalSandpackProvider>
  );
  const { result } = renderHook(() => useSandpack(), { wrapper });

  act(() => {
    result.current.sandpack.runSandpack();
  });

  return result.current;
};

const getAmountOfListener = (
  instance: UseSandpack,
  name = "client-id",
  ignoreGlobalListener = false
): number => {
  return (
    Object.keys(instance.sandpack.clients[name].iframeProtocol.channelListeners)
      .length -
    1 - // less protocol listener
    (ignoreGlobalListener ? 0 : 1) // less the global Sandpack-react listener
  );
};

describe(ExperimentalSandpackProvider, () => {
  describe("updateFile", () => {
    it("adds a file", () => {
      const instance = createContext();

      act(() => {
        instance.sandpack.addFile({ "new-file.js": "new-content" });
      });

      expect(instance.sandpack.files["new-file.js"].code).toBe("new-content");
    });

    it("deletes a file", () => {
      const instance = createContext();

      act(() => {
        instance.sandpack.deleteFile("/App.js");
      });

      expect(instance.sandpack.files["/App.js"]).toBe(undefined);
      expect(Object.keys(instance.sandpack.files)).toEqual([
        "/index.js",
        "/styles.css",
        "/public/index.html",
        "/package.json",
      ]);
    });

    it("updates a file", () => {
      const instance = createContext();

      expect(instance.sandpack.files["/App.js"]).toEqual({
        code: `export default function App() {
  return <h1>Hello World</h1>
}
`,
      });
      act(() => {
        instance.sandpack.updateFile("/App.js", "Foo");
      });

      expect(instance.sandpack.files["/App.js"]).toEqual({ code: `Foo` });
    });

    it("updates multiples files", () => {
      const instance = createContext();

      act(() => {
        instance.sandpack.updateFile({ "/App.js": "Foo", "/index.js": "Baz" });
      });

      expect(instance.sandpack.files["/App.js"]).toEqual({ code: `Foo` });
      expect(instance.sandpack.files["/index.js"]).toEqual({ code: `Baz` });
    });

    it("updates multiples files in a row", () => {
      const instance = createContext();

      act(() => {
        instance.sandpack.updateFile("/App.js", "Foo");
        instance.sandpack.updateFile("/index.js", "Baz");
      });

      expect(instance.sandpack.files["/App.js"]).toEqual({ code: `Foo` });
      expect(instance.sandpack.files["/index.js"]).toEqual({ code: `Baz` });
    });
  });

  describe("editorState", () => {
    it("should return the same initial state", () => {
      const instance = createContext();

      expect(instance.sandpack.editorState).toBe("pristine");
    });

    it("should return a dirty value after updating a file", () => {
      const instance = createContext();

      expect(instance.sandpack.editorState).toBe("pristine");

      act(() => {
        instance.sandpack.updateFile("/App.js", "Foo");
      });
      expect(instance.sandpack.editorState).toBe("dirty");
    });

    it("should return a pristine value after reseting files", () => {
      const instance = createContext();

      expect(instance.sandpack.editorState).toBe("pristine");
      act(() => {
        instance.sandpack.updateFile("/App.js", "Foo");
      });
      expect(instance.sandpack.editorState).toBe("dirty");

      act(() => {
        instance.sandpack.resetAllFiles();
      });
      expect(instance.sandpack.editorState).toBe("pristine");
    });

    it("should return a pristine value after reverting a change", () => {
      const instance = createContext();
      expect(instance.sandpack.editorState).toBe("pristine");

      act(() => {
        instance.sandpack.updateFile("/App.js", "Foo");
      });
      expect(instance.sandpack.editorState).toBe("dirty");

      act(() => {
        instance.sandpack.updateFile(
          "/App.js",
          REACT_TEMPLATE["files"]["/App.js"].code
        );
      });

      expect(instance.sandpack.editorState).toBe("pristine");
    });
  });

  describe("listeners", () => {
    it("sets a listener, but the client hasn't been created yet - no global listener", () => {
      const instance = createContext();

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        instance.listen(mock, "client-id");
      });

      // Act: Create client
      act(() => {
        instance.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
      });

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(
          instance.sandpack.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(instance.sandpack.queuedListenersRef.current.global).length
      ).toBe(0);

      // Expect: one client
      expect(Object.keys(instance.sandpack.clients)).toEqual(["client-id"]);

      /**
       * TODO: figure out how to mock SandpackClient and invoke the listener func
       */
      // expect(mock).toHaveBeenCalled();
    });

    it("sets a listener, but the client hasn't been created yet - global listener", () => {
      const instance = createContext();

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        instance.listen(mock /* , no client-id */);
      });

      // Act: Create client
      act(() => {
        instance.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
      });

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(
          instance.sandpack.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(instance.sandpack.queuedListenersRef.current.global).length
      ).toBe(1);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance)).toBe(1);
    });

    it("set a listener, but the client has already been created - no global listener", () => {
      const instance = createContext();

      // Act: Create client
      act(() => {
        instance.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
      });

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(
          instance.sandpack.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(instance.sandpack.queuedListenersRef.current.global).length
      ).toBe(0);

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        instance.listen(mock, "client-id");
      });

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(
          instance.sandpack.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(instance.sandpack.queuedListenersRef.current.global).length
      ).toBe(0);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance)).toBe(1);
    });

    it("set a listener, but the client has already been created - global listener", () => {
      const instance = createContext();

      // Act: Create client
      act(() => {
        instance.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
      });

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(
          instance.sandpack.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(instance.sandpack.queuedListenersRef.current.global).length
      ).toBe(0);

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        instance.listen(mock /* , no client-id */);
      });

      // Expect: no pending unsubscribe function, because it's a global
      expect(
        Object.keys(
          instance.sandpack.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(0);

      // Expect: one global listener
      expect(
        Object.keys(instance.sandpack.queuedListenersRef.current.global).length
      ).toBe(1);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance)).toBe(1);
    });

    it("sets a new listener, and then create one more client", () => {
      const instance = createContext();

      // Act: Add listener
      act(() => {
        const mock = jest.fn();
        instance.listen(mock, "client-id");
      });

      // Act: Create client
      instance.sandpack.registerBundler(
        document.createElement("iframe"),
        "client-id"
      );

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(
          instance.sandpack.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(instance.sandpack.queuedListenersRef.current.global).length
      ).toBe(0);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance)).toBe(1);

      // Act: Add one more listener
      act(() => {
        const anotherMock = jest.fn();
        instance.listen(anotherMock /* , no client-id */);
      });

      // Expect: one global listener
      expect(
        Object.keys(instance.sandpack.queuedListenersRef.current.global).length
      ).toBe(1);

      // Expect: two listener in the client
      expect(getAmountOfListener(instance)).toBe(2);
    });

    it("unsubscribes only from the assigned client id", () => {
      const instance = createContext();

      act(() => {
        instance.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        instance.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );
      });

      // Initial state
      expect(getAmountOfListener(instance, "client-1")).toBe(0);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(0);

      // Add listeners
      act(() => {
        instance.listen(jest.fn(), "client-1");
      });
      const unsubscribeClientTwo = instance.listen(jest.fn(), "client-2");

      expect(getAmountOfListener(instance, "client-1")).toBe(1);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(1);

      unsubscribeClientTwo();

      expect(getAmountOfListener(instance, "client-1")).toBe(1);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(0);
    });

    it("doesn't trigger global unsubscribe", () => {
      const instance = createContext();

      act(() => {
        instance.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        instance.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );
      });

      act(() => {
        instance.listen(jest.fn());
        instance.listen(jest.fn());
      });
      const unsubscribe = instance.listen(jest.fn());

      expect(getAmountOfListener(instance, "client-1")).toBe(3);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(3);

      unsubscribe();

      expect(getAmountOfListener(instance, "client-1")).toBe(2);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(2);
    });

    it("unsubscribe all the listeners from a specific client when it unmonts", () => {
      const instance = createContext();
      act(() => {
        instance.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        instance.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );

        instance.listen(jest.fn());
        instance.listen(jest.fn());
        instance.listen(jest.fn());
      });

      expect(getAmountOfListener(instance, "client-1")).toBe(3);
      expect(getAmountOfListener(instance, "client-2", true)).toBe(3);

      act(() => {
        instance.sandpack.unregisterBundler("client-2");
      });

      expect(getAmountOfListener(instance, "client-1")).toBe(3);
      expect(instance.sandpack.clients["client-2"]).toBe(undefined);
    });
  });
});
