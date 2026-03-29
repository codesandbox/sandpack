/**
 * @jest-environment jsdom
 */

import * as sandpackClient from "@codesandbox/sandpack-client";
import { renderHook, act } from "@testing-library/react";

import { getSandpackStateFromProps } from "../../utils/sandpackUtils";

import { useClient } from "./useClient";
import type { UseClientOperations } from "./useClient";

const actualSandpackClient = jest.requireActual("@codesandbox/sandpack-client");

jest.mock("@codesandbox/sandpack-client", () => {
  const actual = jest.requireActual("@codesandbox/sandpack-client");

  return {
    ...actual,
    loadSandpackClient: jest.fn((...args) =>
      actual.loadSandpackClient(...args)
    ),
  };
});

const mockedLoadSandpackClient =
  sandpackClient.loadSandpackClient as jest.MockedFunction<
    typeof sandpackClient.loadSandpackClient
  >;

const createMockClient = (iframe: HTMLIFrameElement) => {
  return createMockClientController(iframe).client;
};

const createMockClientController = (iframe: HTMLIFrameElement) => {
  const listeners: sandpackClient.ListenerFunction[] = [];

  return {
    client: {
      status: "initializing",
      iframe,
      listen: jest.fn((listener: sandpackClient.ListenerFunction) => {
        listeners.push(listener);

        return jest.fn(() => {
          const listenerIndex = listeners.indexOf(listener);

          if (listenerIndex >= 0) {
            listeners.splice(listenerIndex, 1);
          }
        });
      }),
      dispatch: jest.fn(),
      updateSandbox: jest.fn(),
      destroy: jest.fn(),
    } as unknown as InstanceType<typeof sandpackClient.SandpackClient>,
    emit(message: sandpackClient.SandpackMessage) {
      listeners.forEach((listener) => {
        listener(message);
      });
    },
  };
};

beforeEach(() => {
  mockedLoadSandpackClient.mockReset();
  mockedLoadSandpackClient.mockImplementation((...args) =>
    actualSandpackClient.loadSandpackClient(...args)
  );
});

const getAmountOfListener = (
  instance: UseClientOperations,
  name = "client-id",
  ignoreGlobalListener = false
): number => {
  return (
    Object.keys(instance.clients[name].iframeProtocol.channelListeners).length -
    1 - // less protocol listener
    (ignoreGlobalListener ? 0 : 1) // less the global Sandpack-react listener
  );
};

describe(useClient, () => {
  describe("listeners", () => {
    it("sets a listener, but the client hasn't been created yet - no global listener", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );

      const operations = result.current[1];

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        operations.addListener(mock, "client-id");
      });

      // Act: Create client
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );

        await operations.runSandpack();
      });

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(
          operations.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length
      ).toBe(0);

      // Expect: one client
      expect(Object.keys(operations.clients)).toEqual(["client-id"]);
    });

    it("sets a listener, but the client hasn't been created yet - global listener", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );

      const operations = result.current[1];

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        operations.addListener(mock /* , no client-id */);
      });

      // Act: Create client
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
        await operations.runSandpack();
      });

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(
          operations.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length
      ).toBe(1);

      // Expect: one listener in the client
      expect(getAmountOfListener(operations)).toBe(1);
    });

    it("set a listener, but the client has already been created - no global listener", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const operations = result.current[1];

      // Act: Create client
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
        await operations.runSandpack();
      });

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(
          operations.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length
      ).toBe(0);

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        operations.addListener(mock, "client-id");
      });

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(
          operations.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length
      ).toBe(0);

      // Expect: one listener in the client
      expect(getAmountOfListener(operations)).toBe(1);
    });

    it("set a listener, but the client has already been created - global listener", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const operations = result.current[1];

      // Act: Create client
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );

        await operations.runSandpack();
      });

      // Expect: no pending unsubscribe function
      expect(
        Object.keys(
          operations.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length
      ).toBe(0);

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        operations.addListener(mock /* , no client-id */);
      });

      // Expect: no pending unsubscribe function, because it's a global
      expect(
        Object.keys(
          operations.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(0);

      // Expect: one global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length
      ).toBe(1);

      // Expect: one listener in the client
      expect(getAmountOfListener(operations)).toBe(1);
    });

    it("sets a new listener, and then create one more client", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const operations = result.current[1];

      // Act: Add listener
      act(() => {
        const mock = jest.fn();
        operations.addListener(mock, "client-id");
      });

      // Act: Create client
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id"
        );
        await operations.runSandpack();
      });

      // Expect: one pending unsubscribe function
      expect(
        Object.keys(
          operations.unsubscribeClientListenersRef.current["client-id"]
        ).length
      ).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length
      ).toBe(0);

      // Expect: one listener in the client
      expect(getAmountOfListener(operations)).toBe(1);

      // Act: Add one more listener
      act(() => {
        const anotherMock = jest.fn();
        operations.addListener(anotherMock /* , no client-id */);
      });

      // Expect: one global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length
      ).toBe(1);

      // Expect: two listener in the client
      expect(getAmountOfListener(operations)).toBe(2);
    });

    it("unsubscribes only from the assigned client id", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );

        await operations.runSandpack();
      });

      // Initial state
      expect(getAmountOfListener(operations, "client-1")).toBe(0);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(0);

      // Add listeners
      act(() => {
        operations.addListener(jest.fn(), "client-1");
      });

      // Add listener only to the client-1
      expect(getAmountOfListener(operations, "client-1")).toBe(1);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(0);

      act(() => {
        operations.addListener(jest.fn(), "client-2");
      });

      // Then add a new listener to client-2
      expect(getAmountOfListener(operations, "client-1")).toBe(1);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(1);
    });

    it("doesn't trigger global unsubscribe", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );

        await operations.runSandpack();
      });

      act(() => {
        operations.addListener(jest.fn());
        operations.addListener(jest.fn());
      });
      const unsubscribe = operations.addListener(jest.fn());

      expect(getAmountOfListener(operations, "client-1")).toBe(3);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(3);

      unsubscribe();

      expect(getAmountOfListener(operations, "client-1")).toBe(2);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(2);
    });

    it("unsubscribe all the listeners from a specific client when it unmonts", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );

        operations.addListener(jest.fn());
        operations.addListener(jest.fn());
        operations.addListener(jest.fn());

        await operations.runSandpack();
      });

      expect(getAmountOfListener(operations, "client-1")).toBe(3);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(3);

      act(() => {
        operations.unregisterBundler("client-2");
      });

      expect(getAmountOfListener(operations, "client-1")).toBe(3);
      expect(operations.clients["client-2"]).toBe(undefined);
    });

    it("restarts sandpack when a new bundler registers after the last client unmounts", async () => {
      mockedLoadSandpackClient.mockImplementation(async (iframeSelector) => {
        return createMockClient(iframeSelector as HTMLIFrameElement);
      });

      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        await operations.runSandpack();
      });

      expect(result.current[0].status).toBe("running");
      expect(operations.clients["client-1"]).toBeDefined();

      act(() => {
        operations.unregisterBundler("client-1");
      });

      expect(result.current[0].status).toBe("idle");
      expect(operations.clients["client-1"]).toBe(undefined);

      const restartedOperations = result.current[1];
      await act(async () => {
        await restartedOperations.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );
      });

      expect(result.current[0].status).toBe("running");
      expect(Object.keys(restartedOperations.clients)).toEqual(["client-2"]);
      expect(mockedLoadSandpackClient).toHaveBeenCalledTimes(2);
    });

    it("replays the latest file update after a client finishes initializing", async () => {
      const iframe = document.createElement("iframe");
      const clientController = createMockClientController(iframe);
      const props = {
        options: {
          recompileMode: "immediate" as const,
        },
      };
      let filesState = getSandpackStateFromProps(props);

      mockedLoadSandpackClient.mockResolvedValue(clientController.client);

      const { result, rerender } = renderHook(() =>
        useClient(props, filesState)
      );
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(iframe, "client-1");
        await operations.runSandpack();
      });

      const appPath =
        Object.keys(filesState.files).find((path) => path.includes("App")) ??
        Object.keys(filesState.files)[0];
      const existingFile = filesState.files[appPath];
      const nextFiles = {
        ...filesState.files,
        [appPath]:
          typeof existingFile === "string"
            ? { code: `${existingFile}\n// queued update` }
            : {
                ...existingFile,
                code: `${existingFile.code}\n// queued update`,
              },
      };

      filesState = {
        ...filesState,
        files: nextFiles,
        shouldUpdatePreview: true,
      };

      await act(async () => {
        rerender();
      });

      expect(clientController.client.updateSandbox).not.toHaveBeenCalled();

      act(() => {
        clientController.emit({
          type: "done",
          compilatonError: false,
        } as sandpackClient.SandpackMessage);
      });

      expect(clientController.client.updateSandbox).toHaveBeenCalledTimes(1);
      expect(clientController.client.updateSandbox).toHaveBeenCalledWith({
        files: nextFiles,
        template: filesState.environment,
      });
    });

    it("keeps only the latest client when the same client id reloads before the first load resolves", async () => {
      const initialIframe = document.createElement("iframe");
      const staleIframe = document.createElement("iframe");
      const freshIframe = document.createElement("iframe");
      const initialController = createMockClientController(initialIframe);
      const staleController = createMockClientController(staleIframe);
      const freshController = createMockClientController(freshIframe);

      let releaseStaleLoad!: () => void;
      const staleLoadBlocked = new Promise<void>((resolve) => {
        releaseStaleLoad = resolve;
      });

      mockedLoadSandpackClient.mockImplementation(async (iframeSelector) => {
        const callCount = mockedLoadSandpackClient.mock.calls.length;

        if (callCount === 1) {
          return initialController.client;
        }

        if (callCount === 2) {
          await staleLoadBlocked;
          return staleController.client;
        }

        return freshController.client;
      });

      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      let operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(initialIframe, "client-1");
        await operations.runSandpack();
      });

      operations = result.current[1];
      let staleRegister!: Promise<void>;
      await act(async () => {
        staleRegister = operations.registerBundler(staleIframe, "client-1");
        await Promise.resolve();
      });

      operations = result.current[1];
      let freshRegister!: Promise<void>;
      await act(async () => {
        freshRegister = operations.registerBundler(freshIframe, "client-1");
        await Promise.resolve();
      });

      releaseStaleLoad();

      await act(async () => {
        await Promise.all([staleRegister, freshRegister]);
      });

      expect(mockedLoadSandpackClient).toHaveBeenCalledTimes(3);
      expect(operations.clients["client-1"]).toBe(freshController.client);
      expect(operations.clients["client-1"].iframe).toBe(freshIframe);
    });
  });

  describe("status", () => {
    it("returns the initial state", () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const state = result.current[0];

      expect(state.status).toBe("initial");
    });

    it("returns the initial state, after register a bundler", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );

      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
      });

      expect(result.current[0].status).toBe("initial");
    });

    it("returns the running state, after init client", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );

        await operations.runSandpack();
      });

      expect(result.current[0].status).toBe("running");
    });

    it("returns the idle state, after unmounting client", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );

        await operations.runSandpack();
      });

      expect(result.current[0].status).toBe("running");

      act(() => {
        operations.unregisterBundler("client-1");
      });

      expect(result.current[0].status).toBe("idle");
    });

    it("keeps running if it unmounts a client and there's still another one running", async () => {
      const { result } = renderHook(() =>
        useClient({}, getSandpackStateFromProps({}))
      );
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1"
        );
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-2"
        );

        await operations.runSandpack();
      });

      act(() => {
        operations.unregisterBundler("client-1");
      });

      expect(result.current[0].status).toBe("running");
    });
  });
});
