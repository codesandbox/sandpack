/**
 * This file is a copy of the resolver from the `codesandbox-api` package.
 * We wanted to avoid to reference codesandbox-api because of the code that runs on load in the package.
 * The plan is to take some time and refactor codesandbox-api into what it was supposed to be in the first place,
 * an abstraction over the actions that can be dispatched between the bundler and the iframe.
 */

import { IFrameProtocol } from "./iframe-protocol";
import type { UnsubscribeFunction, ProtocolRequestMessage } from "./types";

export default class Protocol {
  private _disposeMessageListener: UnsubscribeFunction;

  constructor(
    private type: string,
    private handleMessage: (message: ProtocolRequestMessage) => any,
    private protocol: IFrameProtocol
  ) {
    this._disposeMessageListener = this.protocol.channelListen(async (msg) => {
      if (msg.type === this.getTypeId()) {
        const message = msg as ProtocolRequestMessage;
        try {
          const result = await this.handleMessage(message);
          this.protocol.dispatch({
            type: this.getTypeId(),
            msgId: message.msgId,
            result: result,
          });
        } catch (err: any) {
          this.protocol.dispatch({
            type: this.getTypeId(),
            msgId: message.msgId,
            error: {
              message: err.message,
            },
          });
        }
      }
    });
  }

  getTypeId() {
    return `protocol-${this.type}`;
  }

  public dispose() {
    this._disposeMessageListener();
  }
}
