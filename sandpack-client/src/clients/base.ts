import isEqual from "lodash.isequal";

import type { ListenerFunction, SandpackMessage, UnsubscribeFunction } from "..";
import type {
  NpmRegistry,
  ReactDevToolsMode,
  SandboxInfo,
  SandpackLogLevel,
} from "../types";

export interface ClientOptions {
  /**
   * Paths to external resources
   */
  externalResources?: string[];
  /**
   * Location of the bundler.
   */
  bundlerURL?: string;
  /**
   * Level of logging to do in the bundler
   */
  logLevel?: SandpackLogLevel;
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

  reactDevTools?: ReactDevToolsMode;

  /**
   * The custom private npm registry setting makes it possible
   * to retrieve npm packages from your own npm registry.
   */
  customNpmRegistries?: NpmRegistry[];
}

export class SandpackClientBase {
  options: ClientOptions;
  sandboxInfo: SandboxInfo;
  selector: string | HTMLIFrameElement;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: SandboxInfo,
    options: ClientOptions = {}
  ) {
    this.options = options;
    this.sandboxInfo = sandboxInfo;
    this.selector = selector;
  }

  cleanup(): void {
    throw Error("Method not implemented");
  }

  updatePreview(): void {
    throw Error("Method not implemented");
  }

  updateOptions(options: ClientOptions): void {
    if (!isEqual(this.options, options)) {
      this.options = options;
      this.updatePreview();
    }
  }

  dispatch(_message: SandpackMessage): void {
    throw Error("Method not implemented");
  }

  listen(_listener: ListenerFunction): UnsubscribeFunction {
    throw Error("Method not implemented");
  }
}