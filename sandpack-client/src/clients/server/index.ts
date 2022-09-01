/* eslint-disable no-console,@typescript-eslint/no-explicit-any,prefer-rest-params */
import type { SandboxInfo } from "../..";
import type { ClientOptions } from "../base";
import { SandpackClient } from "../base";
import { BranchInfoDTO } from "./types";
import { WebsocketClient } from "./WebsocketClient";

const getPitcherInstance = async (
  branchId = "e8ifyo"
): Promise<BranchInfoDTO> => {
  const data = await fetch(
    `https://codesandbox.io/api/beta/sandboxes/branches/${branchId}/instance`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer `,
      },
    }
  );

  const managerResponse = await data.json();

  return managerResponse;
};

export class Server extends SandpackClient {
  listener: Record<string, any> = {};

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: SandboxInfo,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxInfo, options);

    getPitcherInstance().then((managerResponse) => {
      this.iframe.contentWindow?.location.replace(
        managerResponse.previewURL.replace("$PORT", "3000")
      );

      const websocketConnection = new WebsocketClient(
        `${managerResponse.pitcherURL}/?token=${managerResponse.pitcherToken}&appId=codesandbox`
      );

      let lastActivity = Date.now();

      websocketConnection.onOpen(() => {
        lastActivity = Date.now();
        // this.onConnectedEmitter.fire();
      });

      websocketConnection.onMessage(async (data) => {
        lastActivity = Date.now();
        if (typeof data !== "string") {
          //   const msg = await websocketMessageIntoBuffer(data);
          //   this.onMessageEmitter.fire(msg);
        }
      });

      websocketConnection.onError((err) => {
        // this.onErrorEmitter.fire(err);
      });

      websocketConnection.connect();

      Object.values(this.listener).forEach((callback) => {
        callback({ type: "done" });
      });
    });
  }

  updatePreview(): any {
    console.log("[server]: updatePreview");
  }

  cleanup(): void {
    console.log("[server]: cleanup");
  }

  dispatch(): void {
    console.log("[server]: dispatch");
  }

  listen(callback: any): any {
    console.log("[server]: dispatch");
    const id = Math.random().toString();

    this.listener[id] = callback;

    return (): any => {
      delete this.listener[id];
    };
  }
}