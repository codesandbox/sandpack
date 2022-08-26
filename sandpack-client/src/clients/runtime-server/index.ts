import { SandboxInfo } from "../..";
import { ClientOptions, SandpackClientBase } from "../base";

export class SandpackClientRuntimeServer extends SandpackClientBase {
  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: SandboxInfo,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxInfo, options);
  }
}