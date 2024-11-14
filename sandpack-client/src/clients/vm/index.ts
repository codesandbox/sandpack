/* eslint-disable no-console,@typescript-eslint/no-explicit-any,prefer-rest-params,@typescript-eslint/explicit-module-boundary-types */

import type { FilesMap } from "@codesandbox/nodebox";
import { connectToSandbox } from "@codesandbox/sdk/browser";
import type { PortInfo } from "@codesandbox/sdk/dist/esm/ports";
import type { SandboxWithoutClient } from "@codesandbox/sdk/dist/esm/sandbox";

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
  readBuffer,
  fromBundlerFilesToFS,
  writeBuffer,
  scanDirectory,
  createLogGroup,
  throwIfTimeout,
} from "./client.utils";
import { loadPreviewIframe, setPreviewIframeProperties } from "./iframe.utils";
import type { SandpackVMMessage } from "./types";

export class SandpackVM extends SandpackClient {
  private emitter: EventEmitter;
  private sandbox!: SandboxWithoutClient;
  public iframe!: HTMLIFrameElement;

  private _modulesCache = new Map();
  private _forkPromise: Promise<void> | null = null;
  private _initPromise: Promise<void> | null = null;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: SandboxSetup,
    options: ClientOptions = {}
  ) {
    const initLog = createLogGroup("Setup");

    super(selector, sandboxInfo, {
      ...options,
      bundlerURL: options.bundlerURL,
    });

    this.emitter = new EventEmitter();

    // Assign iframes
    this.manageIframes(selector);
    initLog.log("Create iframe");

    initLog.log("Trigger initial compile");
    initLog.groupEnd();
    // Trigger initial compile
    this.updateSandbox(sandboxInfo);
  }

  async ensureDirectoryExist(path: string): Promise<void> {
    if (path === ".") {
      return Promise.resolve();
    }

    const directory = path.split("/").slice(0, -1).join("/");

    if (directory === ".") {
      return Promise.resolve();
    }

    try {
      await this.sandbox.fs.mkdir(directory, true);
    } catch {
      // File already exists
    }
  }

  // Initialize sandbox, should only ever be called once
  private async _init(files: FilesMap): Promise<void> {
    const initLog = createLogGroup("Initializing sandbox...");

    this.dispatch({
      type: "vm/progress",
      data: "[1/3] Fetching sandbox...",
    });

    initLog.log("Fetching sandbox...");

    nullthrows(
      this.options.vmEnvironmentApiUrl,
      `No 'options.vmEnvironmentApiUrl' provided. This options is mandatory when using VM as environment`
    );

    nullthrows(
      this.sandboxSetup.templateID,
      `No templateID provided. This options is mandatory when using VM as environment`
    );

    const response = await fetch(
      this.options.vmEnvironmentApiUrl!(this.sandboxSetup.templateID!)
    );
    const sandpackData = await response.json();
    initLog.log("Fetching sandbox success", sandpackData);

    initLog.log("Connecting sandbox...");
    this.sandbox = await Promise.race([
      throwIfTimeout(15_000),
      connectToSandbox(sandpackData),
    ]);
    initLog.log("Connecting sandbox success", this.sandbox);
    initLog.groupEnd();

    this.dispatch({
      type: "vm/progress",
      data: "[2/3] Creating FS...",
    });

    const filesLog = createLogGroup("Files");
    filesLog.log("Writing files...");
    for (const [key, value] of Object.entries(files)) {
      const path = key.startsWith(".") ? key : `.${key}`;
      await this.ensureDirectoryExist(path);

      await this.sandbox.fs.writeFile(path, writeBuffer(value), {
        create: true,
        overwrite: true,
      });
    }
    filesLog.log("Writing files success");

    filesLog.log("Scaning VM FS...");
    const vmFiles = await scanDirectory(".", this.sandbox.fs);

    vmFiles.forEach(({ path, content }) => {
      const pathWithoutLeading = path.startsWith("./")
        ? path.replace("./", "/")
        : path;

      this._modulesCache.set(pathWithoutLeading, content);

      this.dispatch({
        type: "fs/change",
        path: pathWithoutLeading,
        content: readBuffer(content),
      });
    });
    filesLog.log("Scaning VM FS success", vmFiles);
    filesLog.groupEnd();

    await this.globalListeners();
  }

  /**
   * It initializes the emulator and provide it with files, template and script to run
   */
  private async compile(files: FilesMap): Promise<void> {
    try {
      this.status = "initializing";
      this.dispatch({ type: "start", firstLoad: true });
      if (!this._initPromise) {
        this._initPromise = this._init(files);
      }
      await this._initPromise;

      this.dispatch({ type: "connected" });

      await this.setLocationURLIntoIFrame();

      this.dispatchDoneMessage();
    } catch (err) {
      if (this.emitter.listenersCount === 0) {
        throw err;
      }

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

  private awaitForPorts(): Promise<PortInfo[]> {
    return new Promise((resolve) => {
      const initPorts = this.sandbox.ports.getOpenedPorts();

      if (initPorts.length > 0) {
        resolve(initPorts);

        return;
      }

      this.sandbox.ports.onDidPortOpen(() => {
        resolve(this.sandbox.ports.getOpenedPorts());
      });
    });
  }

  private async setLocationURLIntoIFrame(): Promise<void> {
    const initLog = createLogGroup("Preview");

    this.dispatch({
      type: "vm/progress",
      data: "[3/3] Opening preview...",
    });

    initLog.log("Waiting for port...");
    const ports = await this.awaitForPorts();
    initLog.log("Ports found", ports);

    const mainPort = ports.sort((a, b) => {
      return a.port - b.port;
    })[0];

    initLog.log("Defined main port", mainPort);

    initLog.log("Getting preview url for port...");
    const iframePreviewUrl = this.sandbox.ports.getPreviewUrl(mainPort.port);
    initLog.log("Got preview url", iframePreviewUrl);

    if (iframePreviewUrl) {
      initLog.log("Loading preview iframe...");
      await loadPreviewIframe(this.iframe, iframePreviewUrl);
      initLog.log("Preview iframe loaded");
    } else {
      initLog.log("No preview url found");
    }

    initLog.groupEnd();
  }

  /**
   * Send all messages and events to tell to the
   * consumer that the bundler is ready without any error
   */
  private dispatchDoneMessage(): void {
    this.status = "done";
    this.dispatch({ type: "done", compilatonError: false });
  }

  private async globalListeners(): Promise<void> {
    // TYPE:
    //   {
    //     "type": "change",
    //     "paths": [
    //         "/project/sandbox/.git/FETCH_HEAD"
    //     ]
    // }
    // await this.sandbox.fs.watch(
    //   "./",
    //   {
    //     recursive: true,
    //     excludes: [
    //       "**/node_modules/**",
    //       "**/build/**",
    //       "**/dist/**",
    //       "**/vendor/**",
    //       "**/.config/**",
    //       "**/.vuepress/**",
    //       "**/.git/**",
    //       "**/.next/**",
    //       "**/.nuxt/**",
    //     ],
    //   },
    //   (message) => {
    //     console.log(message);
    //   }
    // );
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

  public async fork() {
    this.dispatch({
      type: "vm/progress",
      data: "Forking sandbox...",
    });

    const timer = setTimeout(() => {
      this.dispatch({
        type: "vm/progress",
        data: "Still forking...",
      });
    }, 3_000);

    const response = await fetch(
      this.options.vmEnvironmentApiUrl!(this.sandbox.id),
      { method: "POST" }
    );
    const sandpackData = await response.json();
    this.sandbox = await Promise.race([
      throwIfTimeout(10_000),
      connectToSandbox(sandpackData),
    ]);

    clearTimeout(timer);

    this.dispatch({
      type: "vm/progress",
      data: "Assigining new preview...",
    });
    this.setLocationURLIntoIFrame();

    this.dispatch({
      type: "done",
      compilatonError: false,
    });
  }

  /**
   * PUBLIC Methods
   */
  public async updateSandbox(setup: SandboxSetup) {
    const modules = fromBundlerFilesToFS(setup.files);

    /**
     * Update file changes
     */
    if (this.status === "done") {
      // Stack pending requests
      await this._forkPromise;

      const needToFork = this.sandboxSetup.templateID === this.sandbox.id;
      if (needToFork) {
        this._forkPromise = this.fork();
        await this._forkPromise;
      }

      for await (const [key, value] of Object.entries(modules)) {
        if (
          !this._modulesCache.get(key) ||
          readBuffer(value) !== readBuffer(this._modulesCache.get(key))
        ) {
          const ensureLeadingPath = key.startsWith(".") ? key : "." + key;
          await this.ensureDirectoryExist(ensureLeadingPath);
          console.log(this._modulesCache, key);
          try {
            this.sandbox.fs.writeFile(ensureLeadingPath, writeBuffer(value), {
              create: true,
              overwrite: true,
            });
          } catch (error) {
            console.error(error);
          }
        }
      }

      return;
    }

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

  public async dispatch(message: SandpackVMMessage): Promise<void> {
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

      case "vm/request_editor_url": {
        this.dispatch({
          type: "vm/response_editor_url",
          data: `https://codesandbox.io/p/redirect-to-project-editor/${this.sandbox.id}`,
        });

        break;
      }

      default:
        this.emitter.dispatch(message);
    }
  }

  public listen(listener: ListenerFunction): UnsubscribeFunction {
    return this.emitter.listener(listener);
  }

  public destroy(): void {
    this.emitter.cleanup();
  }
}
