/* eslint-disable no-console,@typescript-eslint/no-explicit-any,prefer-rest-params,@typescript-eslint/explicit-module-boundary-types */

import type { FilesMap } from "@codesandbox/nodebox";
import type { Sandbox } from "@codesandbox/sdk";
import { CodeSandbox } from "@codesandbox/sdk";

import type {
  ClientOptions,
  ListenerFunction,
  SandboxSetup,
  UnsubscribeFunction,
} from "../..";
import { nullthrows } from "../..";
import { SandpackClient } from "../base";
import { EventEmitter } from "../event-emitter";

import {
  getMessageFromError,
  generateRandomId,
  readBuffer,
  fromBundlerFilesToFS,
  writeBuffer,
} from "./client.utils";
import { loadPreviewIframe, setPreviewIframeProperties } from "./iframe.utils";
import type { SandpackNodeMessage } from "./types";
import { PortInfo } from "@codesandbox/sdk/dist/esm/ports";

const token = localStorage.getItem("sandpack-vm") || "";
const sdk = new CodeSandbox(token);

export class SandpackVM extends SandpackClient {
  private emitter: EventEmitter;
  private sandbox!: Sandbox;
  private iframePreviewUrl: string | undefined;
  private _modulesCache = new Map();
  private messageChannelId = generateRandomId();

  // Public
  public iframe!: HTMLIFrameElement;

  private _initPromise: Promise<void> | null = null;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: SandboxSetup,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxInfo, {
      ...options,
      bundlerURL: options.bundlerURL,
    });

    this.emitter = new EventEmitter();

    // Assign iframes
    this.manageIframes(selector);

    // Trigger initial compile
    this.updateSandbox(sandboxInfo);
  }

  async ensureDirectoryExist(path: string): Promise<void> {
    const directory = path.split("/").slice(0, -1).join("/");

    if (directory === ".") {
      return Promise.resolve();
    }

    await this.sandbox.fs.mkdir(directory, true);
  }

  // Initialize sandbox, should only ever be called once
  private async _init(files: FilesMap): Promise<void> {
    this.sandbox = await sdk.createSandbox();

    for (const [key, value] of Object.entries(files)) {
      const path = key.startsWith(".") ? key : `.${key}`;

      await this.ensureDirectoryExist(path);

      await this.sandbox.fs.writeFile(path, writeBuffer(value), {
        create: true,
        overwrite: true,
      });
    }

    await this.globalListeners();
  }

  /**
   * It initializes the emulator and provide it with files, template and script to run
   */
  private async compile(files: FilesMap): Promise<void> {
    try {
      // 1. Init
      this.status = "initializing";
      this.dispatch({ type: "start", firstLoad: true });
      if (!this._initPromise) {
        this._initPromise = this._init(files);
      }
      await this._initPromise;

      this.dispatch({ type: "connected" });

      await this.setLocationURLIntoIFrame();

      // 5. Returns to consumer
      this.dispatchDoneMessage();
    } catch (err) {
      this.dispatch({
        type: "action",
        action: "notification",
        notificationType: "error",
        title: getMessageFromError(err as Error),
      });

      this.dispatch({ type: "done", compilatonError: true });
    }
  }

  /**
   * Nodebox needs to handle two types of iframes at the same time:
   *
   * 1. Runtime iframe: where the emulator process runs, which is responsible
   *    for creating the other iframes (hidden);
   * 2. Preview iframes: any other node process that contains a PORT (public);
   */
  private manageIframes(selector: string | HTMLIFrameElement): void {
    /**
     * Pick the preview iframe
     */
    if (typeof selector === "string") {
      const element = document.querySelector(selector);

      nullthrows(element, `The element '${selector}' was not found`);

      this.iframe = document.createElement("iframe");
      element?.appendChild(this.iframe);
    } else {
      this.iframe = selector;
    }

    // Set preview iframe styles
    setPreviewIframeProperties(this.iframe, this.options);
  }

  private awaitForPorts(): Promise<PortInfo> {
    return new Promise((resolve) => {
      const initPorts = this.sandbox.ports.getOpenedPorts();

      if (initPorts.length > 0) {
        resolve(initPorts[0]);

        return;
      }

      this.sandbox.ports.onDidPortOpen(() => {
        resolve(this.sandbox.ports.getOpenedPorts()[0]);
      });
    });
  }

  private async setLocationURLIntoIFrame(): Promise<void> {
    const port = await this.awaitForPorts();

    this.iframePreviewUrl = this.sandbox.ports.getPreviewUrl(port.port);

    if (this.iframePreviewUrl) {
      await loadPreviewIframe(this.iframe, this.iframePreviewUrl);
    }
  }

  /**
   * Send all messages and events to tell to the
   * consumer that the bundler is ready without any error
   */
  private dispatchDoneMessage(): void {
    this.status = "done";
    this.dispatch({ type: "done", compilatonError: false });

    if (this.iframePreviewUrl) {
      this.dispatch({
        type: "urlchange",
        url: this.iframePreviewUrl,
        back: false,
        forward: false,
      });
    }
  }

  private async globalListeners(): Promise<void> {
    // window.addEventListener("message", (event) => {
    //   if (event.data.type === PREVIEW_LOADED_MESSAGE_TYPE) {
    //     injectScriptToIframe(this.iframe, this.messageChannelId);
    //   }
    //   if (
    //     event.data.type === "urlchange" &&
    //     event.data.channelId === this.messageChannelId
    //   ) {
    //     this.dispatch({
    //       type: "urlchange",
    //       url: event.data.url,
    //       back: event.data.back,
    //       forward: event.data.forward,
    //     });
    //   } else if (event.data.channelId === this.messageChannelId) {
    //     this.dispatch(event.data);
    //   }
    // });
    // await this.sandbox.fs.watch(
    //   "*",
    //   {
    //     excludes: [
    //       ".next",
    //       "node_modules",
    //       "build",
    //       "dist",
    //       "vendor",
    //       ".config",
    //       ".vuepress",
    //     ],
    //   },
    //   async (message) => {
    //     if (!message) return;
    //     debugger;
    //     const event = message as FSWatchEvent;
    //     const path =
    //       "newPath" in event
    //         ? event.newPath
    //         : "path" in event
    //         ? event.path
    //         : "";
    //     const { type } = await this.sandbox.fs.stat(path);
    //     if (type !== "file") return null;
    //     try {
    //       switch (event.type) {
    //         case "change":
    //         case "create": {
    //           const content = await this.sandbox.fs.readFile(event.path);
    //           this.dispatch({
    //             type: "fs/change",
    //             path: event.path,
    //             content: readBuffer(content),
    //           });
    //           this._modulesCache.set(event.path, writeBuffer(content));
    //           break;
    //         }
    //         case "remove":
    //           this.dispatch({
    //             type: "fs/remove",
    //             path: event.path,
    //           });
    //           this._modulesCache.delete(event.path);
    //           break;
    //         case "rename": {
    //           this.dispatch({
    //             type: "fs/remove",
    //             path: event.oldPath,
    //           });
    //           this._modulesCache.delete(event.oldPath);
    //           const newContent = await this.sandbox.fs.readFile(event.newPath);
    //           this.dispatch({
    //             type: "fs/change",
    //             path: event.newPath,
    //             content: readBuffer(newContent),
    //           });
    //           this._modulesCache.set(event.newPath, writeBuffer(newContent));
    //           break;
    //         }
    //         case "close":
    //           break;
    //       }
    //     } catch (err) {
    //       this.dispatch({
    //         type: "action",
    //         action: "notification",
    //         notificationType: "error",
    //         title: getMessageFromError(err as Error),
    //       });
    //     }
    //   }
    // );
  }

  /**
   * PUBLIC Methods
   */
  public async restartShellProcess(): Promise<void> {
    throw Error("Not implemented");
    // if (this.emulatorShellProcess && this.emulatorCommand) {
    //   // 1. Set the loading state and clean the URL
    //   this.dispatch({ type: "start", firstLoad: true });
    //   this.status = "initializing";

    //   // 2. Exit shell
    //   await this.emulatorShellProcess.kill();
    //   this.iframe?.removeAttribute("attr");

    //   this.emulator.fs.rm("/node_modules/.vite", {
    //     recursive: true,
    //     force: true,
    //   });

    //   // 3 Run command again
    //   await this.compile(Object.fromEntries(this._modulesCache));
    // }
  }

  public updateSandbox(setup: SandboxSetup): void {
    const modules = fromBundlerFilesToFS(setup.files);

    /**
     * Update file changes
     */

    // TODO: figure out if sandbox is running
    // if (this.sandbox.?.state === "running") {
    // Object.entries(modules).forEach(([key, value]) => {
    //   if (
    //     !this._modulesCache.get(key) ||
    //     readBuffer(value) !== readBuffer(this._modulesCache.get(key))
    //   ) {
    // this.sandbox.fs.writeFile(key, value, { create: true, overwrite: true });
    //   }
    // });

    // return;
    // }

    /**
     * Pass init files to the bundler
     */
    this.dispatch({
      codesandbox: true,
      modules,
      template: setup.template,
      type: "compile",
    });

    /**
     * Add modules to cache, this will ensure uniqueness changes
     *
     * Keep it after the compile action, in order to update the cache at the right moment
     */
    Object.entries(modules).forEach(([key, value]) => {
      this._modulesCache.set(key, writeBuffer(value));
    });
  }

  public async dispatch(message: SandpackNodeMessage): Promise<void> {
    switch (message.type) {
      case "compile":
        this.compile(message.modules);
        break;

      case "refresh":
        await this.setLocationURLIntoIFrame();
        break;

      case "urlback":
      case "urlforward":
        this.iframe?.contentWindow?.postMessage(message, "*");
        break;

      default:
        this.emitter.dispatch(message);
    }
  }

  public listen(listener: ListenerFunction): UnsubscribeFunction {
    return this.emitter.listener(listener);
  }

  public destroy(): void {
    this.emitter.cleanup();
    this.sandbox.hibernate();
  }
}
