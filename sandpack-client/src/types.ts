export interface SandpackBundlerFile {
  code: string;
}

export interface SandpackBundlerFiles {
  [path: string]: SandpackBundlerFile;
}

export interface Module {
  code: string;
  path: string;
}

export interface Modules {
  [path: string]: {
    code: string;
    path: string;
  };
}

export interface Dependencies {
  [depName: string]: string;
}

export interface ModuleSource {
  fileName: string;
  compiledCode: string;
  sourceMap: Object | undefined;
}

export interface ModuleError {
  title: string;
  message: string;
  path: string;
  line: number;
  column: number;
}

export interface TranspiledModule {
  module: Module;
  query: string;
  source: ModuleSource | undefined;
  assets: {
    [name: string]: ModuleSource;
  };
  isEntry: boolean;
  isTestFile: boolean;
  childModules: Array<string>;
  /**
   * All extra modules emitted by the loader
   */
  emittedAssets: Array<ModuleSource>;
  initiators: Array<string>;
  dependencies: Array<string>;
  asyncDependencies: Array<string>;
  transpilationDependencies: Array<string>;
  transpilationInitiators: Array<string>;
}

export interface BundlerState {
  entry: string;
  transpiledModules: {
    [id: string]: TranspiledModule;
  };
}

export type ClientStatus =
  | 'initializing'
  | 'installing-dependencies'
  | 'transpiling'
  | 'evaluating'
  | 'running-tests'
  | 'idle';
