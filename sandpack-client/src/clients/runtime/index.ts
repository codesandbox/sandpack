import { dequal as deepEqual } from "dequal";

import type { SandpackMessage } from "../..";
import { nullthrows } from "../..";
import { createError } from "../..";
import type {
  BundlerState,
  ClientOptions,
  ClientStatus,
  ListenerFunction,
  Modules,
  SandboxSetup,
  SandpackBundlerFiles,
  SandpackError,
  UnsubscribeFunction,
} from "../../types";
import { SandpackLogLevel } from "../../types";
import {
  extractErrorDetails,
  createPackageJSON,
  addPackageJSONIfNeeded,
} from "../../utils";
import { SandpackClient } from "../base";

import Protocol from "./file-resolver-protocol";
import { IFrameProtocol } from "./iframe-protocol";
import type { SandpackRuntimeMessage } from "./types";
import { getTemplate } from "./utils";

const BUNDLER_URL =
  process.env.CODESANDBOX_ENV === "development"
    ? "http://localhost:3000/"
    : `https://${process.env.PACKAGE_VERSION?.replace(
        /\./g,
        "-"
      )}-sandpack.codesandbox.io/`;

export class SandpackRuntime extends SandpackClient {
  fileResolverProtocol?: Protocol;
  bundlerURL: string;
  bundlerState?: BundlerState;
  errors: SandpackError[];
  status: ClientStatus;

  selector!: string;
  element: Element;

  unsubscribeGlobalListener: UnsubscribeFunction;
  unsubscribeChannelListener: UnsubscribeFunction;
  iframeProtocol: IFrameProtocol;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxSetup: SandboxSetup,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxSetup, options);

    this.bundlerURL = options.bundlerURL || BUNDLER_URL;

    this.bundlerState = undefined;
    this.errors = [];
    this.status = "initializing";

    if (typeof selector === "string") {
      this.selector = selector;
      const element = document.querySelector(selector);

      nullthrows(element, `The element '${selector}' was not found`);

      this.element = element!;
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

      this.iframe.setAttribute(
        "allow",
        "accelerometer; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; clipboard-write;"
      );
    }

    this.setLocationURLIntoIFrame();

    this.iframeProtocol = new IFrameProtocol(this.iframe, this.bundlerURL);

    this.unsubscribeGlobalListener = this.iframeProtocol.globalListen(
      (mes: SandpackMessage) => {
        if (mes.type !== "initialized" || !this.iframe.contentWindow) {
          return;
        }

        this.iframeProtocol.register();

        if (this.options.fileResolver) {
          this.fileResolverProtocol = new Protocol(
            "fs",
            async (data) => {
              if (data.method === "isFile") {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return this.options.fileResolver!.isFile(data.params[0]);
              } else if (data.method === "readFile") {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return this.options.fileResolver!.readFile(data.params[0]);
              } else {
                throw new Error("Method not supported");
              }
            },
            this.iframeProtocol
          );
        }

        this.updateSandbox(this.sandboxSetup, true);
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

  public setLocationURLIntoIFrame(): void {
    const urlSource = this.options.startRoute
      ? new URL(this.options.startRoute, this.bundlerURL).toString()
      : this.bundlerURL;

    this.iframe.contentWindow?.location.replace(urlSource);
    this.iframe.src = urlSource;
  }

  destroy(): void {
    this.unsubscribeChannelListener();
    this.unsubscribeGlobalListener();
    this.iframeProtocol.cleanup();
  }

  updateOptions(options: ClientOptions): void {
    if (!deepEqual(this.options, options)) {
      this.options = options;
      this.updateSandbox();
    }
  }

  updateSandbox(
    sandboxSetup = this.sandboxSetup,
    isInitializationCompile?: boolean
  ): void {
    this.sandboxSetup = {
      ...this.sandboxSetup,
      ...sandboxSetup,
    };

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
      createPackageJSON(
        this.sandboxSetup.dependencies,
        this.sandboxSetup.devDependencies,
        this.sandboxSetup.entry
      )
    );
    try {
      packageJSON = JSON.parse(files["/package.json"].code);
    } catch (e) {
      console.error(
        createError(
          "could not parse package.json file: " + (e as Error).message
        )
      );
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
      reactDevTools: this.options.reactDevTools,
      externalResources: this.options.externalResources || [],
      hasFileResolver: Boolean(this.options.fileResolver),
      disableDependencyPreprocessing:
        this.sandboxSetup.disableDependencyPreprocessing,
      template:
        this.sandboxSetup.template ||
        getTemplate(packageJSON, normalizedModules),
      showOpenInCodeSandbox: this.options.showOpenInCodeSandbox ?? true,
      showErrorScreen: this.options.showErrorScreen ?? true,
      showLoadingScreen: this.options.showLoadingScreen ?? true,
      skipEval: this.options.skipEval || false,
      clearConsoleDisabled: !this.options.clearConsoleOnFirstCompile,
      logLevel: this.options.logLevel ?? SandpackLogLevel.Info,
      customNpmRegistries: this.options.customNpmRegistries,
    });
  }

  public dispatch(message: SandpackRuntimeMessage): void {
    /**
     * Intercept "refresh" dispatch: this will make sure
     * that the iframe is still in the location it's supposed to be.
     * External links inside the iframe will change the location and
     * prevent the user from navigating back.
     */
    if (message.type === "refresh") {
      this.setLocationURLIntoIFrame();
    }

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

  private getFiles(): SandpackBundlerFiles {
    const { sandboxSetup } = this;

    if (sandboxSetup.files["/package.json"] === undefined) {
      return addPackageJSONIfNeeded(
        sandboxSetup.files,
        sandboxSetup.dependencies,
        sandboxSetup.devDependencies,
        sandboxSetup.entry
      );
    }

    return this.sandboxSetup.files;
  }

  private initializeElement(): void {
    this.iframe.style.border = "0";
    this.iframe.style.width = this.options.width || "100%";
    this.iframe.style.height = this.options.height || "100%";
    this.iframe.style.overflow = "hidden";

    nullthrows(
      this.element.parentNode,
      "The given iframe does not have a parent."
    );

    this.element.parentNode!.replaceChild(this.iframe, this.element);
  }
}
