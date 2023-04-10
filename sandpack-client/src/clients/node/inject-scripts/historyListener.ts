/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/explicit-function-return-type, no-restricted-globals, @typescript-eslint/no-explicit-any  */

export function setupHistoryListeners({
  scope,
}: {
  scope: { channelId: string };
}) {
  // @ts-ignore
  const origHistoryProto = window.history.__proto__;

  const historyList: Array<{ state: string; url: string }> = [];
  let historyPosition = 0;

  const dispatchMessage = (url: string) => {
    parent.postMessage(
      {
        type: "urlchange",
        url,
        back: historyPosition > 0,
        forward: historyPosition < historyList.length - 1,
        channelId: scope.channelId,
      },
      "*"
    );
  };

  function pushHistory(url: string, state: string) {
    // remove "future" locations
    historyList.splice(historyPosition + 1);
    historyList.push({ url, state });
    historyPosition = historyList.length - 1;
  }

  Object.assign(window.history, {
    go(delta: number) {
      const newPos = historyPosition + delta;
      if (newPos >= 0 && newPos <= historyList.length - 1) {
        historyPosition = newPos;

        const { url, state } = historyList[historyPosition];
        origHistoryProto.replaceState.call(window.history, state, "", url);

        const newURL = document.location.href;
        dispatchMessage(newURL);

        window.dispatchEvent(new PopStateEvent("popstate", { state }));
      }
    },

    back() {
      window.history.go(-1);
    },

    forward() {
      window.history.go(1);
    },

    pushState(state: string, title: string, url: string) {
      origHistoryProto.replaceState.call(window.history, state, title, url);
      pushHistory(url, state);
      dispatchMessage(document.location.href);
    },

    replaceState(state: string, title: string, url: string) {
      origHistoryProto.replaceState.call(window.history, state, title, url);
      historyList[historyPosition] = { state, url };
      dispatchMessage(document.location.href);
    },
  });

  interface NavigationMessage {
    type: "urlback" | "urlforward" | "refresh";
  }
  function handleMessage({ data }: { data: NavigationMessage }) {
    if (data.type === "urlback") {
      history.back();
    } else if (data.type === "urlforward") {
      history.forward();
    } else if (data.type === "refresh") {
      document.location.reload();
    }
  }

  window.addEventListener("message", handleMessage);
}
