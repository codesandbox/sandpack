/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { InjectMessage } from "@codesandbox/nodebox";
import { INJECT_MESSAGE_TYPE } from "@codesandbox/nodebox";

// get the bundled file, which contains all dependencies
// @ts-ignore
import consoleHook from "./dist/consoleHook.js";
import { setupHistoryListeners } from "./historyListener";

const scripts = [
  { code: setupHistoryListeners.toString(), id: "historyListener" },
  {
    code: "function consoleHook() {" + consoleHook + "\n};",
    id: "consoleHook",
  },
];

export const injectScriptToIframe = (iframe: HTMLIFrameElement): void => {
  scripts.forEach(({ code, id }) => {
    const message: InjectMessage = {
      uid: id,
      type: INJECT_MESSAGE_TYPE,
      code: `exports.activate = ${code}`,
      scope: {},
    };

    iframe.contentWindow?.postMessage(message, "*");
  });
};
