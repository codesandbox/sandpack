/**
 * This file is a copy of the resolver from the `codesandbox-api` package.
 * We wanted to avoid to reference codesandbox-api because of the code that runs on load in the package.
 * The plan is to take some time and refactor codesandbox-api into what it was supposed to be in the first place,
 * an abstraction over the actions that can be dispatched between the bundler and the iframe.
 */

import type { IFrameProtocol } from "./iframe-protocol";
import type {
  UnsubscribeFunction,
  ProtocolRequestMessage,
  ProtocolResultMessage,
  ProtocolErrorMessage,
} from "../../types";

export default class Protocol {
  private _disposeMessageListener: UnsubscribeFunction;

  constructor(
    private type: string,
    private handleMessage: (message: ProtocolRequestMessage) => any,
    private protocol: IFrameProtocol
  ) {
    this._disposeMessageListener = this.protocol.channelListen(
      async (msg: any) => {
        if (msg.type === this.getTypeId() && msg.method) {
          const message = msg as ProtocolRequestMessage;
          try {
            const result = await this.handleMessage(message);
            const response: ProtocolResultMessage = {
              type: this.getTypeId(),
              msgId: message.msgId,
              result: result,
            };
            this.protocol.dispatch(response as any);
          } catch (err: any) {
            const response: ProtocolErrorMessage = {
              type: this.getTypeId(),
              msgId: message.msgId,
              error: {
                message: err.message,
              },
            };
            this.protocol.dispatch(response as any);
          }
        }
      }
    );
  }

  getTypeId() {
    return `protocol-${this.type}`;
  }

  public dispose() {
    this._disposeMessageListener();
  }
}
