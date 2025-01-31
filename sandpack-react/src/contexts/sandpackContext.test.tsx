/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import React from "react";

import type { UseSandpack } from "..";
import { REACT_TEMPLATE, useSandpack } from "..";

import { SandpackProvider } from "./sandpackContext";

jest.useFakeTimers();

const createContext = async (): Promise<{ current: UseSandpack }> => {
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SandpackProvider template="react">{children}</SandpackProvider>
  );
  const { result } = renderHook(() => useSandpack(), { wrapper });

  await act(async () => {
    result.current.sandpack.runSandpack();
  });

  return result;
};

const getAmountOfListener = (
  /* eslint-disable @typescript-eslint/no-explicit-any */
  instance: any,
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

describe(SandpackProvider, () => {
  describe("updateFile", () => {
    it("adds a file", async () => {
      const instance = await createContext();

      act(() => {
        instance.current.sandpack.addFile({ "new-file.js": "new-content" });
      });

      expect(instance.current.sandpack.files["/new-file.js"].code).toBe(
        "new-content"
      );
    });

    it("deletes a file", async () => {
      const instance = await createContext();

      act(() => {
        instance.current.sandpack.deleteFile("/App.js");
      });

      expect(instance.current.sandpack.files["/App.js"]).toBe(undefined);
      expect(Object.keys(instance.current.sandpack.files)).toEqual([
        "/styles.css",
        "/index.js",
        "/public/index.html",
        "/package.json",
      ]);
    });

    it("deletes the activeFile and set the following visibleFile as active", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <SandpackProvider
          options={{ activeFile: "/App.js", visibleFiles: ["/styles.css"] }}
          template="react"
        >
          {children}
        </SandpackProvider>
      );
      const { result } = renderHook(() => useSandpack(), { wrapper });

      await act(async () => {
        result.current.sandpack.runSandpack();
        result.current.sandpack.deleteFile("/App.js");
      });

      expect(result.current.sandpack.activeFile).toBe("/styles.css");
    });

    it("deletes the activeFile and set the entry file if there no visibleFile left", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <SandpackProvider
          options={{ activeFile: "/App.js", visibleFiles: [] }}
          template="react"
        >
          {children}
        </SandpackProvider>
      );
      const { result } = renderHook(() => useSandpack(), { wrapper });

      await act(async () => {
        result.current.sandpack.runSandpack();
        result.current.sandpack.deleteFile("/App.js");
      });

      expect(result.current.sandpack.activeFile).toBe("/package.json");
    });

    it("updates a file", async () => {
      const instance = await createContext();

      expect(instance.current.sandpack.files["/App.js"]).toEqual({
        code: `export default function App() {
  return <h1>Hello world</h1>
}
`,
      });
      act(() => {
        instance.current.sandpack.updateFile("/App.js", "Foo");
      });

      expect(instance.current.sandpack.files["/App.js"]).toEqual({
        code: `Foo`,
      });
    });

    it("updates multiples files", async () => {
      const instance = await createContext();

      act(() => {
        instance.current.sandpack.updateFile({
          "/App.js": "Foo",
          "/index.js": "Baz",
        });
      });

      expect(instance.current.sandpack.files["/App.js"]).toEqual({
        code: `Foo`,
      });
      expect(instance.current.sandpack.files["/index.js"]).toEqual({
        code: `Baz`,
      });
    });

    it("updates multiples files in a row", async () => {
      const instance = await createContext();

      act(() => {
        instance.current.sandpack.updateFile("/App.js", "Foo");
      });
      act(() => {
        instance.current.sandpack.updateFile("/index.js", "Baz");
      });

      expect(instance.current.sandpack.files["/App.js"]).toEqual({
        code: `Foo`,
      });
      expect(instance.current.sandpack.files["/index.js"]).toEqual({
        code: `Baz`,
      });
    });
  });

  describe("editorState", () => {
    it("should return the same initial state", async () => {
      const instance = await createContext();

      expect(instance.current.sandpack.editorState).toBe("pristine");
    });

    it("should return a dirty value after updating a file", async () => {
      const instance = await createContext();

      expect(instance.current.sandpack.editorState).toBe("pristine");

      act(() => {
        instance.current.sandpack.updateFile("/App.js", "Foo");
      });
      expect(instance.current.sandpack.editorState).toBe("dirty");
    });

    it("should return a pristine value after reset files", async () => {
      const instance = await createContext();

      expect(instance.current.sandpack.editorState).toBe("pristine");
      act(() => {
        instance.current.sandpack.updateFile("/App.js", "Foo");
      });
      expect(instance.current.sandpack.editorState).toBe("dirty");

      act(() => {
        instance.current.sandpack.resetAllFiles();
      });
      expect(instance.current.sandpack.editorState).toBe("pristine");
    });

    it("should return a pristine value after reverting a change", async () => {
      const instance = await createContext();
      expect(instance.current.sandpack.editorState).toBe("pristine");

      act(() => {
        instance.current.sandpack.updateFile("/App.js", "Foo");
      });
      expect(instance.current.sandpack.editorState).toBe("dirty");

      act(() => {
        instance.current.sandpack.updateFile(
          "/App.js",
          REACT_TEMPLATE["files"]["/App.js"].code
        );
      });

      expect(instance.current.sandpack.editorState).toBe("pristine");
    });
  });

  describe("listeners", () => {
    it("sets a listener, but the client hasn't been created yet - no global listener", async () => {
      const instance = await createContext();

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        instance.current.listen(mock, "client-id");
      });

      // Act: Create client
      await act(async () => {
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
      });

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(
          instance.current.sandpack.unsubscribeClientListenersRef.current[
            "client-id"
          ]
        ).length
      ).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(instance.current.sandpack.queuedListenersRef.current.global)
          .length
      ).toBe(0);

      // Expect: one client
      expect(Object.keys(instance.current.sandpack.clients)).toEqual([
        "client-id",
      ]);

      /**
       * TODO: figure out how to mock SandpackClient and invoke the listener func
       */
      // expect(mock).toHaveBeenCalled();
    });

    it("sets a listener, but the client hasn't been created yet - global listener", async () => {
      const instance = await createContext();

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        instance.current.listen(mock /* , no client-id */);
      });

      // Act: Create client
      await act(async () => {
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
      });

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(
          instance.current.sandpack.unsubscribeClientListenersRef.current[
            "client-id"
          ]
        ).length
      ).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(instance.current.sandpack.queuedListenersRef.current.global)
          .length
      ).toBe(1);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance.current)).toBe(1);
    });

    it("set a listener, but the client has already been created - no global listener", async () => {
      const instance = await createContext();

      // Act: Create client
      await act(async () => {
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
      });

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(
          instance.current.sandpack.unsubscribeClientListenersRef.current[
            "client-id"
          ]
        ).length
      ).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(instance.current.sandpack.queuedListenersRef.current.global)
          .length
      ).toBe(0);

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        instance.current.listen(mock, "client-id");
      });

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(
          instance.current.sandpack.unsubscribeClientListenersRef.current[
            "client-id"
          ]
        ).length
      ).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(instance.current.sandpack.queuedListenersRef.current.global)
          .length
      ).toBe(0);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance.current)).toBe(1);
    });

    it("set a listener, but the client has already been created - global listener", async () => {
      const instance = await createContext();

      // Act: Create client
      await act(async () => {
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
      });

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(
          instance.current.sandpack.unsubscribeClientListenersRef.current[
            "client-id"
          ]
        ).length
      ).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(instance.current.sandpack.queuedListenersRef.current.global)
          .length
      ).toBe(0);

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        instance.current.listen(mock /* , no client-id */);
      });

      // Expect: no pending unsubscribe function, because it's a global
      expect(
        Object.keys(
          instance.current.sandpack.unsubscribeClientListenersRef.current[
            "client-id"
          ]
        ).length
      ).toBe(0);

      // Expect: one global listener
      expect(
        Object.keys(instance.current.sandpack.queuedListenersRef.current.global)
          .length
      ).toBe(1);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance.current)).toBe(1);
    });

    it("sets a new listener, and then create one more client", async () => {
      const instance = await createContext();

      // Act: Add listener
      act(() => {
        const mock = jest.fn();
        instance.current.listen(mock, "client-id");
      });

      // Act: Createasync  client
      await act(async () => {
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
      });

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(
          instance.current.sandpack.unsubscribeClientListenersRef.current[
            "client-id"
          ]
        ).length
      ).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(instance.current.sandpack.queuedListenersRef.current.global)
          .length
      ).toBe(0);

      // Expect: one listener in the client
      expect(getAmountOfListener(instance.current)).toBe(1);

      // Act: Add one more listener
      act(() => {
        const anotherMock = jest.fn();
        instance.current.listen(anotherMock /* , no client-id */);
      });

      // Expect: one global listener
      expect(
        Object.keys(instance.current.sandpack.queuedListenersRef.current.global)
          .length
      ).toBe(1);

      // Expect: two listener in the client
      expect(getAmountOfListener(instance.current)).toBe(2);
    });

    it("unsubscribes only from the assigned client id", async () => {
      const instance = await createContext();

      await act(async () => {
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );
      });

      // Initial state
      expect(getAmountOfListener(instance.current, "client-1")).toBe(0);
      expect(getAmountOfListener(instance.current, "client-2", true)).toBe(0);

      // Add listeners
      act(() => {
        instance.current.listen(jest.fn(), "client-1");
      });
      const unsubscribeClientTwo = instance.current.listen(
        jest.fn(),
        "client-2"
      );

      expect(getAmountOfListener(instance.current, "client-1")).toBe(1);
      expect(getAmountOfListener(instance.current, "client-2", true)).toBe(1);

      unsubscribeClientTwo();

      expect(getAmountOfListener(instance.current, "client-1")).toBe(1);
      expect(getAmountOfListener(instance.current, "client-2", true)).toBe(0);
    });

    it("doesn't trigger global unsubscribe", async () => {
      const instance = await createContext();

      await act(async () => {
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );
      });

      act(() => {
        instance.current.listen(jest.fn());
        instance.current.listen(jest.fn());
      });
      const unsubscribe = instance.current.listen(jest.fn());

      expect(getAmountOfListener(instance.current, "client-1")).toBe(3);
      expect(getAmountOfListener(instance.current, "client-2", true)).toBe(3);

      unsubscribe();

      expect(getAmountOfListener(instance.current, "client-1")).toBe(2);
      expect(getAmountOfListener(instance.current, "client-2", true)).toBe(2);
    });

    it("unsubscribe all the listeners from a specific client when it unmonts", async () => {
      const instance = await createContext();
      await act(async () => {
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        await instance.current.sandpack.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );

        instance.current.listen(jest.fn());
        instance.current.listen(jest.fn());
        instance.current.listen(jest.fn());
      });

      expect(getAmountOfListener(instance.current, "client-1")).toBe(3);
      expect(getAmountOfListener(instance.current, "client-2", true)).toBe(3);

      act(() => {
        instance.current.sandpack.unregisterBundler("client-2");
      });

      expect(getAmountOfListener(instance.current, "client-1")).toBe(3);
      expect(instance.current.sandpack.clients["client-2"]).toBe(undefined);
    });
  });
});
