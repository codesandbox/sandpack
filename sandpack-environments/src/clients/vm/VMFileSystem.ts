import type { SandboxSession } from "@codesandbox/sdk";

import type { DirectoryEntry, SandpackFileSystem } from "../../types";

export class VMFileSystem implements SandpackFileSystem {
  constructor(
    private sandboxPromise: Promise<SandboxSession>,
    private workspacePath: string
  ) {}

  async writeFile(path: string, content: string): Promise<void> {
    const sandbox = await this.sandboxPromise;

    await sandbox.fs.writeTextFile(this.workspacePath + path, content, {
      create: true,
      overwrite: true,
    });
  }

  writeFileMetadata(path: string, metadata: object): void {
    // Not needed in VMs
  }

  readFileMetadata(path: string) {
    return {};
  }

  async readFile(path: string): Promise<string> {
    const sandbox = await this.sandboxPromise;
    const file = await sandbox.fs.readFile(this.workspacePath + path);

    return new TextDecoder().decode(file);
  }

  async readDirectory(path: string): Promise<DirectoryEntry[]> {
    const sandbox = await this.sandboxPromise;
    const entries = await sandbox.fs.readdir(this.workspacePath + path);

    return entries;
  }

  createDirectory(path: string): Promise<void> {
    throw new Error("Not implemented");
  }

  deleteFile(path: string): Promise<void> {
    throw new Error("Not implemented");
  }

  deleteDirectory(path: string): Promise<void> {
    throw new Error("Not implemented");
  }

  watchDirectory(path: string, callback: () => void): () => void {
    const watcherPromise = this.sandboxPromise.then((sandbox) =>
      sandbox.fs.watch(this.workspacePath + path)
    );

    watcherPromise.then((watcher) => {
      watcher.onEvent(callback);
    });

    return () => {
      watcherPromise.then((watcher) => {
        watcher.dispose();
      });
    };
  }

  watch(callback: () => void): () => void {
    throw new Error("Not implemented");
  }

  dispose(): void {
    // Clean up resources if needed
  }
}
