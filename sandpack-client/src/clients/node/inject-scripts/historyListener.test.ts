/**
 * @jest-environment jsdom
 */
import { setupHistoryListeners } from "./historyListener";

describe("historyListener", () => {
  let mockPostMessage: jest.Mock;
  let mockAddEventListener: jest.Mock;
  let historyBackSpy: jest.SpyInstance;

  beforeEach(() => {
    mockPostMessage = jest.fn();
    mockAddEventListener = jest.fn();

    // Mock parent postMessage
    (global as any).parent = {
      postMessage: mockPostMessage,
    };

    // Mock window methods
    window.addEventListener = mockAddEventListener;
    historyBackSpy = jest.spyOn(window.history, "back").mockImplementation(() => {});

    Object.defineProperty(window, "location", {
      value: {
        href: "https://sandbox.com",
        reload: jest.fn(),
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should ignore messages from unauthorized origins", () => {
    setupHistoryListeners({
      scope: { channelId: "123", parentOrigin: "https://trusted.com" },
    });
    
    const historyGoSpy = jest.spyOn(window.history, "go").mockImplementation(() => {});

    const handleMessage = mockAddEventListener.mock.calls.find(
      (call) => call[0] === "message"
    )[1];

    handleMessage({
      data: { type: "urlback" },
      origin: "https://malicious.com",
    });

    expect(historyGoSpy).not.toHaveBeenCalled();
  });

  it("should accept messages from authorized origin", () => {
    setupHistoryListeners({
      scope: { channelId: "123", parentOrigin: "https://trusted.com" },
    });

    const historyGoSpy = jest.spyOn(window.history, "go").mockImplementation(() => {});

    const handleMessage = mockAddEventListener.mock.calls.find(
      (call) => call[0] === "message"
    )[1];

    handleMessage({
      data: { type: "urlback" },
      origin: "https://trusted.com",
    });

    expect(historyGoSpy).toHaveBeenCalledWith(-1);
  });
});
