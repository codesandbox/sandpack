import { getTemplate } from "codesandbox-import-utils/lib/create-sandbox/templates";
import isEqual from "lodash.isequal";

// Muhahaha
// eslint-disable-next-line
// @ts-ignore
import { version } from "../package.json";

import Protocol from "./file-resolver-protocol";
import { IFrameProtocol } from "./iframe-protocol";
import type {
  Dependencies,
  SandpackBundlerFiles,
  BundlerState,
  Modules,
  ClientStatus,
  UnsubscribeFunction,
  SandpackMessage,
  ListenerFunction,
  SandpackError,
} from "./types";
import {
  createPackageJSON,
  addPackageJSONIfNeeded,
  extractErrorDetails,
} from "./utils";

export interface ClientOptions {
  /**
   * Location of the bundler.
   */
  bundlerURL?: string;
  /**
   * Relative path that the iframe loads (eg: /about)
   */
  startRoute?: string;
  /**
   * Width of iframe.
   */
  width?: string;
  /**
   * Height of iframe.
   */
  height?: string;
  /**
   * If we should skip the third step: evaluation.
   */
  skipEval?: boolean;

  /**
   * Boolean flags to trigger certain UI elements in the bundler
   */
  showOpenInCodeSandbox?: boolean;
  showErrorScreen?: boolean;
  showLoadingScreen?: boolean;

  /**
   * The bundler will clear the console if you set this to true, everytime the iframe refreshes / starts the first compile
   */
  clearConsoleOnFirstCompile?: boolean;

  /**
   * You can pass a custom file resolver that is responsible for resolving files.
   * We will use this to get all files from the file system.
   */
  fileResolver?: {
    isFile: (path: string) => Promise<boolean>;
    readFile: (path: string) => Promise<string>;
  };
}

export interface SandboxInfo {
  files: SandpackBundlerFiles;
  dependencies?: Dependencies;
  entry?: string;
  /**
   * What template we use, if not defined we infer the template from the dependencies or files.
   *
   * @type {string}
   */
  template?: string;

  /**
   * Only use unpkg for fetching the dependencies, no preprocessing. It's slower, but doesn't talk
   * to AWS.
   */
  disableDependencyPreprocessing?: boolean;
}

const BUNDLER_URL =
  process.env.CODESANDBOX_ENV === "development"
    ? "http://localhost:3000/"
    : `https://${version.replace(/\./g, "-")}-sandpack.codesandbox.io/`;

export class SandpackClient {
  selector: string | undefined;
  element: Element;
  iframe: HTMLIFrameElement;
  iframeProtocol: IFrameProtocol;
  options: ClientOptions;

  fileResolverProtocol?: Protocol;
  bundlerURL: string;
  bundlerState?: BundlerState;
  errors: SandpackError[];
  status: ClientStatus;

  sandboxInfo: SandboxInfo;

  unsubscribeGlobalListener: UnsubscribeFunction;
  unsubscribeChannelListener: UnsubscribeFunction;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: SandboxInfo,
    options: ClientOptions = {}
  ) {
    this.options = options;
    this.sandboxInfo = sandboxInfo;
    this.bundlerURL = options.bundlerURL || BUNDLER_URL;

    this.bundlerState = undefined;
    this.errors = [];
    this.status = "initializing";

    if (typeof selector === "string") {
      this.selector = selector;
      const element = document.querySelector(selector);

      if (!element) {
        throw new Error(`No element found for selector '${selector}'`);
      }

      this.element = element;
      this.iframe = document.createElement("iframe");
      this.initializeElement();
    } else {
      this.element = selector;
      this.iframe = selector;
    }
    if (!this.iframe.getAttribute("sandbox")) {
      this.iframe.setAttribute(
        "sandbox",
        "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      );
    }

    this.iframe.src = options.startRoute
      ? new URL(options.startRoute, this.bundlerURL).toString()
      : this.bundlerURL;
    this.iframeProtocol = new IFrameProtocol(this.iframe, this.bundlerURL);

    this.unsubscribeGlobalListener = this.iframeProtocol.globalListen(
      (mes: SandpackMessage) => {
        if (mes.type !== "initialized" || !this.iframe.contentWindow) {
          return;
        }

        this.iframeProtocol.register();

        if (this.options.fileResolver) {
          // TODO: Find a common place for the Protocol to be implemented for both sandpack-core and sandpack-client
          this.fileResolverProtocol = new Protocol(
            "file-resolver",
            async (data: { m: "isFile" | "readFile"; p: string }) => {
              if (data.m === "isFile") {
                return this.options.fileResolver!.isFile(data.p);
              }

              return this.options.fileResolver!.readFile(data.p);
            },
            this.iframe.contentWindow
          );
        }

        this.updatePreview(this.sandboxInfo, true);
      }
    );

    this.unsubscribeChannelListener = this.iframeProtocol.channelListen(
      (mes: SandpackMessage) => {
        switch (mes.type) {
          case "start": {
            this.errors = [];
            break;
          }
          case "status": {
            this.status = mes.status;
            break;
          }
          case "action": {
            if (mes.action === "show-error") {
              this.errors = [...this.errors, extractErrorDetails(mes)];
            }
            break;
          }
          case "state": {
            this.bundlerState = mes.state;
            break;
          }
        }
      }
    );
  }

  cleanup(): void {
    this.unsubscribeChannelListener();
    this.unsubscribeGlobalListener();
    this.iframeProtocol.cleanup();
  }

  updateOptions(options: ClientOptions): void {
    if (!isEqual(this.options, options)) {
      this.options = options;
      this.updatePreview();
    }
  }

  updatePreview(
    sandboxInfo = this.sandboxInfo,
    isInitializationCompile?: boolean
  ): void {
    this.sandboxInfo = sandboxInfo;

    const files = this.getFiles();

    const modules: Modules = Object.keys(files).reduce(
      (prev, next) => ({
        ...prev,
        [next]: {
          code: files[next].code,
          path: next,
        },
      }),
      {}
    );

    let packageJSON = JSON.parse(
      createPackageJSON(this.sandboxInfo.dependencies, this.sandboxInfo.entry)
    );
    try {
      packageJSON = JSON.parse(files["/package.json"].code);
    } catch (e) {
      console.error("Could not parse package.json file: " + e.message);
    }

    // TODO move this to a common format
    const normalizedModules = Object.keys(files).reduce(
      (prev, next) => ({
        ...prev,
        [next]: {
          content: files[next].code,
          path: next,
        },
      }),
      {}
    );

    this.dispatch({
      type: "compile",
      codesandbox: true,
      version: 3,
      isInitializationCompile,
      modules,
      externalResources: [],
      hasFileResolver: Boolean(this.options.fileResolver),
      disableDependencyPreprocessing: this.sandboxInfo
        .disableDependencyPreprocessing,
      template:
        this.sandboxInfo.template ||
        getTemplate(packageJSON, normalizedModules),
      showOpenInCodeSandbox: this.options.showOpenInCodeSandbox ?? true,
      showErrorScreen: this.options.showErrorScreen ?? true,
      showLoadingScreen: this.options.showLoadingScreen ?? true,
      skipEval: this.options.skipEval || false,
      clearConsoleDisabled: !this.options.clearConsoleOnFirstCompile,
    });
  }

  public dispatch(message: SandpackMessage): void {
    this.iframeProtocol.dispatch(message);
  }

  public listen(listener: ListenerFunction): UnsubscribeFunction {
    return this.iframeProtocol.channelListen(listener);
  }

  /**
   * Get the URL of the contents of the current sandbox
   */
  public getCodeSandboxURL(): Promise<{
    sandboxId: string;
    editorUrl: string;
    embedUrl: string;
  }> {
    const files = this.getFiles();

    const paramFiles = Object.keys(files).reduce(
      (prev, next) => ({
        ...prev,
        [next.replace("/", "")]: {
          content: files[next].code,
          isBinary: false,
        },
      }),
      {}
    );

    return fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
      method: "POST",
      body: JSON.stringify({ files: paramFiles }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((x) => x.json())
      .then((res: { sandbox_id: string }) => ({
        sandboxId: res.sandbox_id,
        editorUrl: `https://codesandbox.io/s/${res.sandbox_id}`,
        embedUrl: `https://codesandbox.io/embed/${res.sandbox_id}`,
      }));
  }

  public getTranspilerContext = (): Promise<
    Record<string, Record<string, unknown>>
  > =>
    new Promise((resolve) => {
      const unsubscribe = this.listen((message) => {
        if (message.type === "transpiler-context") {
          resolve(message.data);

          unsubscribe();
        }
      });

      this.dispatch({ type: "get-transpiler-context" });
    });

  private getFiles() {
    const { sandboxInfo } = this;

    if (sandboxInfo.files["/package.json"] === undefined) {
      return addPackageJSONIfNeeded(
        sandboxInfo.files,
        sandboxInfo.dependencies,
        sandboxInfo.entry
      );
    }

    return this.sandboxInfo.files;
  }

  private initializeElement() {
    this.iframe.style.border = "0";
    this.iframe.style.width = this.options.width || "100%";
    this.iframe.style.height = this.options.height || "100%";
    this.iframe.style.overflow = "hidden";

    if (!this.element.parentNode) {
      // This should never happen
      throw new Error("Given element does not have a parent.");
    }

    this.element.parentNode.replaceChild(this.iframe, this.element);
  }
}
