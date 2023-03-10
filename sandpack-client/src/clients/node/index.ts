/* eslint-disable no-console,@typescript-eslint/no-explicit-any,prefer-rest-params,@typescript-eslint/explicit-module-boundary-types */

import { Buffer } from "buffer";

import { PREVIEW_LOADED_MESSAGE_TYPE, Nodebox } from "@codesandbox/nodebox";
import type {
  FilesMap,
  ShellProcess,
  FSWatchEvent,
} from "@codesandbox/nodebox";
import type { ShellCommandOptions } from "@codesandbox/nodebox/build/modules/shell";

import type {
  ClientOptions,
  ListenerFunction,
  SandboxSetup,
  UnsubscribeFunction,
} from "../..";
import { nullthrows } from "../..";
import { createError } from "../..";
import { SandpackClient } from "../base";
import { EventEmitter } from "../event-emitter";

import {
  fromBundlerFilesToFS,
  readBuffer,
  findStartScriptPackageJson,
  getMessageFromError,
  writeBuffer,
} from "./client.utils";
import { loadPreviewIframe, setPreviewIframeProperties } from "./iframe.utils";
import { injectScriptToIframe } from "./inject-scripts";
import type { SandpackNodeMessage } from "./types";

export class SandpackNode extends SandpackClient {
  // General
  private emitter: EventEmitter;

  // Nodebox
  private emulatorIframe!: HTMLIFrameElement;
  private emulator!: Nodebox;
  private emulatorShellProcess: ShellProcess | undefined;
  private emulatorCommand: [string, string[], ShellCommandOptions] | undefined;
  private iframePreviewUrl: string | undefined;
  private _modulesCache = new Map();

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

    // Init emulator
    this.emulator = new Nodebox({
      iframe: this.emulatorIframe,
      runtimeUrl: this.options.bundlerURL,
    });
  }

  // Initialize nodebox, should only ever be called once
  private async _init(files: FilesMap): Promise<void> {
    await this.emulator.connect();

    // 2. Setup
    await this.emulator.fs.init(files);

    // 2.1 Other dependencies
    await this.globalListeners();
  }

  /**
   * It initializes the emulator and provide it with files, template and script to run
   */
  private async compile(files: FilesMap): Promise<void> {
    try {
      // 1. Init
      this.dispatch({ type: "start", firstLoad: true });
      if (!this._initPromise) {
        this._initPromise = this._init(files);
      }
      await this._initPromise;

      this.dispatch({ type: "connected" });

      // 3. Create, run task and assign preview
      const { id: shellId } = await this.createShellProcessFromTask(files);

      // 4. Launch Preview
      await this.createPreviewURLFromId(shellId);
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
   * It creates a new shell and run the starting task
   */
  private async createShellProcessFromTask(
    files: FilesMap
  ): Promise<{ id: string }> {
    const packageJsonContent = readBuffer(files["/package.json"]);

    this.emulatorCommand = findStartScriptPackageJson(packageJsonContent);
    this.emulatorShellProcess = this.emulator.shell.create();

    // Shell listeners
    await this.emulatorShellProcess.on("exit", (exitCode) => {
      this.dispatch({
        type: "action",
        action: "notification",
        notificationType: "error",
        title: createError(`Error: process.exit(${exitCode}) called.`),
      });
    });

    await this.emulatorShellProcess.on("progress", (data) => {
      if (
        data.state === "command_running" ||
        data.state === "starting_command"
      ) {
        this.dispatch({
          type: "shell/progress",
          data: {
            ...data,
            command: [
              this.emulatorCommand?.[0],
              this.emulatorCommand?.[1].join(" "),
            ].join(" "),
          },
        });

        return;
      }

      this.dispatch({ type: "shell/progress", data });
    });

    this.emulatorShellProcess.stdout.on("data", (data) => {
      this.dispatch({ type: "stdout", payload: { data, type: "out" } });
    });

    this.emulatorShellProcess.stderr.on("data", (data) => {
      this.dispatch({ type: "stdout", payload: { data, type: "err" } });
    });

    return await this.emulatorShellProcess.runCommand(...this.emulatorCommand);
  }

  private async createPreviewURLFromId(id: string): Promise<void> {
    this.iframePreviewUrl = undefined;

    const { url } = await this.emulator.preview.getByShellId(id);

    this.iframePreviewUrl = url;
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
    } else {
      this.iframe = selector;
    }

    // Set preview iframe styles
    setPreviewIframeProperties(this.iframe, this.options);

    nullthrows(
      this.iframe.parentNode,
      `The given iframe does not have a parent.`
    );

    /**
     * Create the runtime iframe, which is hidden sibling
     * from the preview one
     */
    this.emulatorIframe = document.createElement("iframe");
    this.emulatorIframe.classList.add("sp-bridge-frame");
    this.iframe.parentNode?.appendChild(this.emulatorIframe);
  }

  private async setLocationURLIntoIFrame(): Promise<void> {
    if (this.iframePreviewUrl) {
      await loadPreviewIframe(this.iframe, this.iframePreviewUrl);
    }
  }

  /**
   * Send all messages and events to tell to the
   * consumer that the bundler is ready without any error
   */
  private dispatchDoneMessage(): void {
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
    window.addEventListener("message", (event) => {
      if (event.data.type === PREVIEW_LOADED_MESSAGE_TYPE) {
        injectScriptToIframe(this.iframe);
      }

      if (event.data.type === "urlchange") {
        this.dispatch({
          type: "urlchange",
          url: event.data.url,
          back: event.data.back,
          forward: event.data.forward,
        });
      }

      this.dispatch(event.data);
    });

    await this.emulator.fs.watch(
      ["*"],
      [
        ".next",
        "node_modules",
        "build",
        "dist",
        "vendor",
        ".config",
        ".vuepress",
      ],

      async (message) => {
        if (!message) return;

        const event = message as FSWatchEvent;

        const path =
          "newPath" in event
            ? event.newPath
            : "path" in event
            ? event.path
            : "";
        const { type } = await this.emulator.fs.stat(path);
        if (type !== "file") return null;

        try {
          switch (event.type) {
            case "change":
            case "create": {
              const content = await this.emulator.fs.readFile(
                event.path,
                "utf8"
              );
              this.dispatch({
                type: "fs/change",
                path: event.path,
                content: content,
              });

              this._modulesCache.set(event.path, writeBuffer(content));

              break;
            }
            case "remove":
              this.dispatch({
                type: "fs/remove",
                path: event.path,
              });

              this._modulesCache.delete(event.path);

              break;

            case "rename": {
              this.dispatch({
                type: "fs/remove",
                path: event.oldPath,
              });

              this._modulesCache.delete(event.oldPath);

              const newContent = await this.emulator.fs.readFile(
                event.newPath,
                "utf8"
              );
              this.dispatch({
                type: "fs/change",
                path: event.newPath,
                content: newContent,
              });

              this._modulesCache.set(event.newPath, writeBuffer(newContent));

              break;
            }

            case "close":
              break;
          }
        } catch (err) {
          this.dispatch({
            type: "action",
            action: "notification",
            notificationType: "error",
            title: getMessageFromError(err as Error),
          });
        }
      }
    );
  }

  /**
   * PUBLIC Methods
   */

  public async restartShellProcess(): Promise<void> {
    if (this.emulatorShellProcess && this.emulatorCommand) {
      // 1. Set the loading state and clean the URL
      this.dispatch({ type: "start", firstLoad: true });

      // 2. Exit shell
      await this.emulatorShellProcess.kill();
      this.iframe?.removeAttribute("attr");

      // 3 Run command again
      await this.compile(Object.fromEntries(this._modulesCache));
    }
  }

  public updateSandbox(setup: SandboxSetup): any {
    const modules = fromBundlerFilesToFS(setup.files);

    /**
     * Update file changes
     */
    if (this.emulatorShellProcess?.state === "running") {
      Object.entries(modules).forEach(([key, value]) => {
        if (
          !this._modulesCache.get(key) ||
          Buffer.compare(value, this._modulesCache.get(key)) !== 0
        ) {
          this.emulator.fs.writeFile(key, value, { recursive: true });
        }
      });

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

    // Add modules to cache, this will ensure uniqueness changes
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

      case "shell/restart":
        this.restartShellProcess();
        break;

      case "shell/openPreview":
        window.open(this.iframePreviewUrl, "_blank");
        break;

      default:
        this.emitter.dispatch(message);
    }
  }

  public listen(listener: ListenerFunction): UnsubscribeFunction {
    return this.emitter.listener(listener);
  }

  public destroy(): void {
    this.emulatorIframe.remove();
    this.emitter.cleanup();
  }
}
