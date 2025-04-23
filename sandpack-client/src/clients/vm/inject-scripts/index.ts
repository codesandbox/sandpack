/* eslint-disable @typescript-eslint/ban-ts-comment */

// get the bundled file, which contains all dependencies
// @ts-ignore
import consoleHook from "../../../inject-scripts/dist/consoleHook.js";

import { setupHistoryListeners } from "./historyListener";
import { watchResize } from "./resize.js";

const INJECT_MESSAGE_TYPE = "INJECT_AND_INVOKE";

export interface Message {
  type: string;
}
type BaseScope = Record<string, unknown>;
export interface InjectMessage<Scope = BaseScope> {
  uid: string;
  type: typeof INJECT_MESSAGE_TYPE;
  code: string;
  scope: Scope;
}

const scripts = [
  { code: setupHistoryListeners.toString(), id: "historyListener" },
  {
    code: "function consoleHook({ scope }) {" + consoleHook + "\n};",
    id: "consoleHook",
  },
  { code: watchResize.toString(), id: "watchResize" },
];

export const injectScriptToIframe = (
  iframe: HTMLIFrameElement,
  channelId: string
): void => {
  scripts.forEach(({ code, id }) => {
    const message: InjectMessage = {
      uid: id,
      type: INJECT_MESSAGE_TYPE,
      code: `exports.activate = ${code}`,
      scope: { channelId },
    };

    iframe.contentWindow?.postMessage(message, "*");
  });
};
