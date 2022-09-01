import { getTemplate } from "codesandbox-import-utils/lib/create-sandbox/templates";
import isEqual from "lodash.isequal";

import type {
  SandpackBundlerFiles,
  BundlerState,
  Modules,
  ClientStatus,
  UnsubscribeFunction,
  SandpackMessage,
  ListenerFunction,
  SandpackError,
  SandboxInfo,
} from "../../types";
import { SandpackLogLevel } from "../../types";
import {
  createPackageJSON,
  addPackageJSONIfNeeded,
  extractErrorDetails,
} from "../../utils";
import type { ClientOptions } from "../base";
import { SandpackClient } from "../base";

import Protocol from "./file-resolver-protocol";
import { IFrameProtocol } from "./iframe-protocol";

const BUNDLER_URL =
  process.env.CODESANDBOX_ENV === "development"
    ? "http://localhost:3000/"
    : `https://${process.env.PACKAGE_VERSION?.replace(
        /\./g,
        "-"
      )}-sandpack.codesandbox.io/`;

export class Runtime extends SandpackClient {
  fileResolverProtocol?: Protocol;
  bundlerURL: string;
  bundlerState?: BundlerState;
  errors: SandpackError[];
  status: ClientStatus;

  unsubscribeGlobalListener: UnsubscribeFunction;
  unsubscribeChannelListener: UnsubscribeFunction;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: SandboxInfo,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxInfo, options);
    this.bundlerURL = options.bundlerURL || BUNDLER_URL;

    this.bundlerState = undefined;
    this.errors = [];
    this.status = "initializing";

    const urlSource = options.startRoute
      ? new URL(options.startRoute, this.bundlerURL).toString()
      : this.bundlerURL;

    this.iframe.contentWindow?.location.replace(urlSource);

    this.iframeProtocol = new IFrameProtocol(this.iframe, this.bundlerURL);

    this.unsubscribeGlobalListener = this.iframeProtocol.globalListen(
      (mes: SandpackMessage) => {
        if (mes.type !== "initialized" || !this.iframe?.contentWindow) {
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
    this.sandboxInfo = {
      ...this.sandboxInfo,
      ...sandboxInfo,
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
        this.sandboxInfo.dependencies,
        this.sandboxInfo.devDependencies,
        this.sandboxInfo.entry
      )
    );
    try {
      packageJSON = JSON.parse(files["/package.json"].code);
    } catch (e) {
      console.error(
        "[sandpack-client]: could not parse package.json file: " +
          (e as Error).message
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
        this.sandboxInfo.disableDependencyPreprocessing,
      template:
        this.sandboxInfo.template ||
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

  private getFiles(): SandpackBundlerFiles {
    const { sandboxInfo } = this;

    if (sandboxInfo.files["/package.json"] === undefined) {
      return addPackageJSONIfNeeded(
        sandboxInfo.files,
        sandboxInfo.dependencies,
        sandboxInfo.devDependencies,
        sandboxInfo.entry
      );
    }

    return this.sandboxInfo.files;
  }
}