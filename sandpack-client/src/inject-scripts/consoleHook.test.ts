/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Methods from "console-feed/lib/definitions/Methods";

const flush = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe("consoleHook", () => {
  const originalScope = (globalThis as any).scope;
  const originalMethods = new Map<string, unknown>();

  beforeEach(() => {
    jest.resetModules();
    originalMethods.clear();

    for (const method of Methods) {
      originalMethods.set(method, (window.console as any)[method]);
    }

    (globalThis as any).scope = { channelId: "test-channel" };
  });

  afterEach(() => {
    jest.restoreAllMocks();

    for (const [method, originalMethod] of originalMethods.entries()) {
      if (typeof originalMethod === "undefined") {
        delete (window.console as any)[method];
      } else {
        (window.console as any)[method] = originalMethod;
      }
    }

    if (typeof originalScope === "undefined") {
      delete (globalThis as any).scope;
    } else {
      (globalThis as any).scope = originalScope;
    }
  });

  it("captures array values before later mutations", async () => {
    const postMessageSpy = jest
      .spyOn(window.parent, "postMessage")
      .mockImplementation(() => undefined);
    jest.spyOn(window.console, "log").mockImplementation(() => undefined);

    require("./consoleHook");

    const numbers = [1, 2, 3];
    window.console.log(numbers);
    numbers.push(4);

    await flush();

    expect(postMessageSpy).toHaveBeenCalledTimes(1);
    const [message, targetOrigin] = postMessageSpy.mock.calls[0];

    expect(targetOrigin).toBe("*");
    expect((message as any).channelId).toBe("test-channel");
    expect((message as any).log.method).toBe("log");
    expect((message as any).log.data[0]).toEqual([1, 2, 3]);
  });

  it("keeps primitive payloads unchanged", async () => {
    const postMessageSpy = jest
      .spyOn(window.parent, "postMessage")
      .mockImplementation(() => undefined);
    jest.spyOn(window.console, "info").mockImplementation(() => undefined);

    require("./consoleHook");

    window.console.info("Theme updated");

    await flush();

    expect(postMessageSpy).toHaveBeenCalledTimes(1);
    const [message] = postMessageSpy.mock.calls[0];

    expect((message as any).log.method).toBe("info");
    expect((message as any).log.data).toEqual(["Theme updated"]);
  });
});
