import type { InMemoryFileSystem } from "../../InMemoryFileSystem";
import type {
  SandpackPreviewMessage,
  SandpackPreviewStatus,
} from "../../types";

import Protocol from "./file-resolver-protocol";
import { IFrameProtocol } from "./iframe-protocol.js";
import { EXTENSIONS_MAP } from "./mime";
import type {
  IPreviewRequestMessage,
  IPreviewResponseMessage,
  ListenerFunction,
  Modules,
  SandpackBundlerFile,
  SandpackBundlerFiles,
  UnsubscribeFunction,
} from "./types";
import {
  CHANNEL_NAME,
  SandpackLogLevel,
  type BundlerState,
  type SandpackError,
  type SandpackMessage,
} from "./types";
import {
  addPackageJSONIfNeeded,
  createError,
  createPackageJSON,
  extractErrorDetails,
  getExtension,
  getTemplate,
  readAllFiles,
} from "./utils";

import type { SandpackBundlerEnvironmentOptions } from "./index";

const SUFFIX_PLACEHOLDER = "-{{suffix}}";

const BUNDLER_URL =
  process.env.CODESANDBOX_ENV === "development"
    ? "http://localhost:3000/"
    : `https://${process.env.PACKAGE_VERSION?.replace(
        /\./g,
        "-"
      )}${SUFFIX_PLACEHOLDER}-sandpack.codesandbox.io/`;

export class SandpackBundlerPreview {
  private disposers = new Set<() => void>();
  private iframeMessageSubscribers = new Set<
    (message: SandpackPreviewMessage) => void
  >();
  private statusSubscribers = new Set<
    (status: SandpackPreviewStatus) => void
  >();
  private iframe: HTMLIFrameElement;
  private bundlerURL: string;
  private bundlerState?: BundlerState;
  private errors: SandpackError[] = [];
  private _status: SandpackPreviewStatus = {
    current: "LOADING",
    progress: [],
  };
  get status() {
    return this._status;
  }
  set status(newStatus) {
    this._status = newStatus;
    this.statusSubscribers.forEach((subscriber) => {
      subscriber(newStatus);
    });
  }
  private fileResolverProtocol?: Protocol;
  private iframeProtocol: IFrameProtocol;
  constructor(
    iframe: HTMLIFrameElement,
    private options: SandpackBundlerEnvironmentOptions,
    private fs: InMemoryFileSystem
  ) {
    this.bundlerURL = this.createBundlerURL();
    this.iframe = this.configureIframe(iframe);
    this.iframeProtocol = this.configureIframeProtocol();
    this.setLocationURLIntoIFrame();
  }
  private createBundlerURL() {
    let bundlerURL = this.options.bundlerURL || BUNDLER_URL;

    // if it's a custom, skip the rest
    if (this.options.bundlerURL) {
      return bundlerURL;
    }

    if (this.options.teamId) {
      bundlerURL =
        bundlerURL.replace("https://", "https://" + this.options.teamId + "-") +
        `?cache=${Date.now()}`;
    }

    if (this.options.experimental_enableServiceWorker) {
      const suffixes: string[] = [];
      suffixes.push(Math.random().toString(36).slice(4));

      bundlerURL = bundlerURL.replace(
        SUFFIX_PLACEHOLDER,
        `-${
          this.options.experimental_stableServiceWorkerId ?? suffixes.join("-")
        }`
      );
    } else {
      bundlerURL = bundlerURL.replace(SUFFIX_PLACEHOLDER, "");
    }

    return bundlerURL;
  }

  private configureIframeProtocol() {
    const iframeProtocol = new IFrameProtocol(this.iframe, this.bundlerURL);

    this.disposers.add(
      iframeProtocol.globalListen((mes: SandpackMessage) => {
        if (mes.type !== "initialized" || !this.iframe.contentWindow) {
          return;
        }

        iframeProtocol.register();

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

        this.updateSandbox();
      })
    );

    this.disposers.add(
      iframeProtocol.channelListen((mes: SandpackMessage) => {
        switch (mes.type) {
          case "start": {
            this.errors = [];
            this.status = {
              current: "LOADING",
              progress: [],
            };
            break;
          }
          case "status": {
            if (this.status.current === "LOADING") {
              this.status.progress.push(mes.status);
            }
            break;
          }
          case "action": {
            if (mes.action === "show-error") {
              this.errors = [...this.errors, extractErrorDetails(mes)];
            }
            break;
          }
          case "done": {
            this.status = {
              current: "READY",
            };
            break;
          }
          case "state": {
            this.bundlerState = mes.state;
            break;
          }
        }
      })
    );

    if (this.options.experimental_enableServiceWorker) {
      this.serviceWorkerHandshake();
    }

    return iframeProtocol;
  }

  setLocationURLIntoIFrame(): void {
    const urlSource = this.options.startRoute
      ? new URL(this.options.startRoute, this.bundlerURL).toString()
      : this.bundlerURL;

    this.iframe.contentWindow?.location.replace(urlSource);
    this.iframe.src = urlSource;
  }

  private configureIframe(iframe: HTMLIFrameElement) {
    if (!iframe.getAttribute("sandbox")) {
      iframe.setAttribute(
        "sandbox",
        "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-downloads allow-pointer-lock"
      );

      iframe.setAttribute(
        "allow",
        "accelerometer; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; clipboard-read; clipboard-write; xr-spatial-tracking;"
      );
    }

    return iframe;
  }

  private serviceWorkerHandshake() {
    const channel = new MessageChannel();

    const iframeContentWindow = this.iframe.contentWindow;
    if (!iframeContentWindow) {
      throw new Error("Could not get iframe contentWindow");
    }

    const port = channel.port1;
    port.onmessage = (evt: MessageEvent) => {
      if (typeof evt.data === "object" && evt.data.$channel === CHANNEL_NAME) {
        switch (evt.data.$type) {
          case "preview/ready":
            // no op for now
            break;
          case "preview/request":
            this.handleWorkerRequest(evt.data, port);

            break;
        }
      }
    };

    const sendMessage = () => {
      const initMsg = {
        $channel: CHANNEL_NAME,
        $type: "preview/init",
      };

      iframeContentWindow.postMessage(initMsg, "*", [channel.port2]);

      this.iframe.removeEventListener("load", sendMessage);
    };

    this.iframe.addEventListener("load", sendMessage);
  }

  public getTranspiledFiles = (): Promise<
    Array<{ path: string; code: string }>
  > => {
    return new Promise((resolve) => {
      const unsubscribe = this.listen((message) => {
        if (message.type === "all-modules") {
          resolve(message.data);

          unsubscribe();
        }
      });

      this.dispatch({ type: "get-modules" });
    });
  };

  private async getFiles(): Promise<SandpackBundlerFiles> {
    const files = await readAllFiles(this.fs, "/", {});

    if (files["/package.json"] === undefined) {
      return addPackageJSONIfNeeded(
        files,
        this.options.dependencies,
        this.options.devDependencies,
        this.options.entry
      );
    }

    return files;
  }

  private async handleWorkerRequest(
    request: IPreviewRequestMessage,
    port: MessagePort
  ) {
    const notFound = () => {
      const responseMessage: IPreviewResponseMessage = {
        $channel: CHANNEL_NAME,
        $type: "preview/response",
        id: request.id,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
        status: 404,
        body: "File not found",
      };

      port.postMessage(responseMessage);
    };
    try {
      const filepath = new URL(request.url, this.bundlerURL).pathname;

      const headers: Record<string, string> = {};

      const files = await this.getFiles();
      let file = files[filepath];

      if (!file) {
        const modulesFromManager = await this.getTranspiledFiles();

        file = modulesFromManager.find((item) =>
          item.path.endsWith(filepath)
        ) as SandpackBundlerFile;

        if (!file) {
          notFound();
          return;
        }
      }

      const body = file.code;

      if (!headers["Content-Type"]) {
        const extension = getExtension(filepath);
        const foundMimetype = EXTENSIONS_MAP.get(extension);
        if (foundMimetype) {
          headers["Content-Type"] = foundMimetype;
        }
      }

      const responseMessage: IPreviewResponseMessage = {
        $channel: CHANNEL_NAME,
        $type: "preview/response",
        id: request.id,
        headers,
        status: 200,
        body,
      };

      port.postMessage(responseMessage);
    } catch (err) {
      console.error(err);
      notFound();
    }
  }

  public dispatch(message: SandpackMessage): void {
    /**
     * Intercept "refresh" dispatch: this will make sure
     * that the iframe is still in the location it's supposed to be.
     * External links inside the iframe will change the location and
     * prevent the user from navigating back.
     */
    if (message.type === "refresh") {
      this.setLocationURLIntoIFrame();

      if (this.options.experimental_enableServiceWorker) {
        this.serviceWorkerHandshake();
      }
    }

    this.iframeProtocol.dispatch(message);
  }

  public listen(listener: ListenerFunction): UnsubscribeFunction {
    return this.iframeProtocol.channelListen(listener);
  }

  onStatusChange(
    callback: (status: SandpackPreviewStatus) => void
  ): () => void {
    this.statusSubscribers.add(callback);
    return () => {
      this.statusSubscribers.delete(callback);
    };
  }

  async updateSandbox() {
    const files = await this.getFiles();

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
        this.options.dependencies,
        this.options.devDependencies,
        this.options.entry
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

    const payload = {
      ...this.options,
      type: "compile",
      codesandbox: true,
      version: 3,
      isInitializationCompile: true,
      modules,
      reactDevTools: this.options.reactDevTools,
      externalResources: this.options.externalResources || [],
      hasFileResolver: Boolean(this.options.fileResolver),
      disableDependencyPreprocessing:
        this.options.disableDependencyPreprocessing,
      experimental_enableServiceWorker:
        this.options.experimental_enableServiceWorker,
      template:
        this.options.template || getTemplate(packageJSON, normalizedModules),
      showOpenInCodeSandbox: this.options.showOpenInCodeSandbox ?? true,
      showErrorScreen: this.options.showErrorScreen ?? true,
      showLoadingScreen: this.options.showLoadingScreen ?? false,
      skipEval: this.options.skipEval || false,
      clearConsoleDisabled: !this.options.clearConsoleOnFirstCompile,
      logLevel: this.options.logLevel ?? SandpackLogLevel.Info,
      customNpmRegistries: this.options.customNpmRegistries,
      teamId: this.options.teamId,
      sandboxId: this.options.sandboxId,
    } as any;

    console.log({ payload });

    this.dispatch(payload);
  }

  dispose(): void {
    this.disposers.forEach((dispose) => {
      dispose();
    });
    this.disposers.clear();
  }
}
