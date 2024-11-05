/* eslint-disable @typescript-eslint/no-explicit-any */

export function watchResize({ scope }: { scope: { channelId: string } }) {
  let lastHeight = 0;

  function getDocumentHeight(): number {
    if (typeof window === "undefined") return 0;

    const { body } = document;
    const html = document.documentElement;

    return Math.max(body.scrollHeight, body.offsetHeight, html.offsetHeight);
  }

  function sendResizeEvent() {
    const height = getDocumentHeight();

    if (lastHeight !== height) {
      window.parent.postMessage(
        {
          type: "resize",
          height,
          codesandbox: true,
          channelId: scope.channelId,
        },
        "*"
      );
    }

    lastHeight = height;
  }

  sendResizeEvent();

  let throttle: any;
  const observer = new MutationObserver(() => {
    if (throttle === undefined) {
      sendResizeEvent();

      throttle = setTimeout(() => {
        throttle = undefined;
      }, 300);
    }
  });

  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  /**
   * Ideally we should only use a `MutationObserver` to trigger a resize event,
   * however, we noted that it's not 100% reliable, so we went for polling strategy as well
   */
  setInterval(sendResizeEvent, 300);
}
