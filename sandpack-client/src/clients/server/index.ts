import {} from "@codesandbox/pitcher-client";

/* eslint-disable no-console,@typescript-eslint/no-explicit-any,prefer-rest-params */
import type { SandboxInfo } from "../..";
import type { ClientOptions } from "../base";
import { SandpackClient } from "../base";
import { BranchInfoDTO } from "./types";

const getPitcherInstance = async (
  branchId = "e8ifyo"
): Promise<BranchInfoDTO> => {
  const data = await fetch(
    `https://codesandbox.io/api/beta/sandboxes/branches/${branchId}/instance`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJDb2RlU2FuZGJveCIsImV4cCI6MTY2MjAyOTg4NCwiaWF0IjoxNjYyMDI5Mjg0LCJpc3MiOiJDb2RlU2FuZGJveCIsImp0aSI6IjlkMmYwZjQzLWQ0MDUtNDEyZi1hZWY1LTM4NTk3NDI3MWU5YSIsIm5iZiI6MTY2MjAyOTI4MywicGVybWlzc2lvbiI6InNvY2tldCIsInN1YiI6IlVzZXI6ZDNmYTU1NGYtZmNlNC00MjY2LTg2NGQtMTM1NDMzOTY4ZTEzIiwidHlwIjoiYWNjZXNzIn0.rPd3oSWig1Ku0DDQexf5pVF9OXC9XYIahXdbv-a0-q-EwSUPN5HGSrEfZWtZmKVn-LfIIft5bAW-bcxj0l0VnQ"`,
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