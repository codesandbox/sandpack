import type { FileContent } from "./sandpack-bundler-types";
import type { SandpackFileSystem } from "./types";
import { normalizePath } from "./utils";

interface Directory {
  name: string;
  path: string;
  files: Set<string>;
  subdirectories: Set<string>;
}

export class InMemoryFileSystem implements SandpackFileSystem {
  private files: Record<string, FileContent> = {};
  private directories: Record<string, Directory> = {};
  private watchers: Record<string, Set<() => void>> = {};
  private globalWatchers: Set<() => void> = new Set();

  constructor() {
    // Initialize root directory
    this.directories["/"] = {
      name: "/",
      path: "/",
      files: new Set<string>(),
      subdirectories: new Set<string>(),
    };
  }

  private ensureDirectoryExists(path: string): void {
    const normalizedPath = normalizePath(path);
    if (normalizedPath === "/") return; // Root always exists

    const parts = normalizedPath.split("/").filter(Boolean);
    let currentPath = "/";

    // Create parent directories if they don't exist
    for (let i = 0; i < parts.length; i++) {
      const dirName = parts[i];
      const nextPath = `${currentPath}${dirName}/`;

      if (!this.directories[nextPath]) {
        this.directories[nextPath] = {
          name: dirName,
          path: nextPath,
          files: new Set<string>(),
          subdirectories: new Set<string>(),
        };

        // Add to parent's subdirectories
        this.directories[currentPath].subdirectories.add(nextPath);
      }

      currentPath = nextPath;
    }
  }

  private getDirectoryForFile(filePath: string): string {
    const normalizedPath = normalizePath(filePath);
    const lastSlashIndex = normalizedPath.lastIndexOf("/");
    if (lastSlashIndex <= 0) return "/"; // Root directory
    return normalizedPath.substring(0, lastSlashIndex + 1);
  }

  async writeFile(path: string, content: string) {
    const normalizedPath = normalizePath(path);
    const dirPath = this.getDirectoryForFile(normalizedPath);

    // Ensure parent directory exists
    this.ensureDirectoryExists(dirPath);

    // Add file to directory
    this.directories[dirPath].files.add(normalizedPath);

    // Store file content
    this.files[normalizedPath] = content;

    // Notify watchers
    if (this.watchers[normalizedPath]) {
      this.watchers[normalizedPath].forEach((callback) => callback());
    }

    // Notify global watchers
    this.notifyGlobalWatchers();
  }

  async readFile(path: string) {
    const normalizedPath = normalizePath(path);
    if (!this.files[normalizedPath]) {
      throw new Error(`ENOENT: no such file '${path}'`);
    }
    return this.files[normalizedPath];
  }

  async readDirectory(path: string) {
    const normalizedPath = normalizePath(path);
    const directoryPath = normalizedPath.endsWith("/")
      ? normalizedPath
      : `${normalizedPath}/`;

    if (!this.directories[directoryPath]) {
      throw new Error(`ENOENT: no such directory '${path}'`);
    }

    const directory = this.directories[directoryPath];

    // Get file entries
    const fileEntries = Array.from(directory.files).map((filePath) => {
      const parts = filePath.split("/");
      return {
        name: parts[parts.length - 1],
        type: "file" as const,
      };
    });

    // Get directory entries
    const dirEntries = Array.from(directory.subdirectories).map((dirPath) => {
      // Remove trailing slash and get the last part
      const name = dirPath.endsWith("/") ? dirPath.slice(0, -1) : dirPath;
      const parts = name.split("/");
      return {
        name: parts[parts.length - 1],
        type: "directory" as const,
      };
    });

    return [...fileEntries, ...dirEntries];
  }

  async createDirectory(path: string): Promise<void> {
    const normalizedPath = normalizePath(path);
    const directoryPath = normalizedPath.endsWith("/")
      ? normalizedPath
      : `${normalizedPath}/`;

    this.ensureDirectoryExists(directoryPath);

    // Notify watchers
    if (this.watchers[directoryPath]) {
      this.watchers[directoryPath].forEach((callback) => callback());
    }

    // Notify global watchers
    this.notifyGlobalWatchers();
  }

  async deleteDirectory(path: string): Promise<void> {
    const normalizedPath = normalizePath(path);
    const directoryPath = normalizedPath.endsWith("/")
      ? normalizedPath
      : `${normalizedPath}/`;

    if (!this.directories[directoryPath]) {
      return; // Directory doesn't exist, nothing to delete
    }

    // Get all files in this directory and subdirectories
    const filesToDelete = this.getAllFilesInDirectory(directoryPath);

    // Delete all files
    for (const filePath of filesToDelete) {
      delete this.files[filePath];

      // Notify watchers
      if (this.watchers[filePath]) {
        this.watchers[filePath].forEach((callback) => callback());
      }
    }

    // Delete from parent's subdirectories
    const parentPath = this.getParentDirectoryPath(directoryPath);
    if (parentPath && this.directories[parentPath]) {
      this.directories[parentPath].subdirectories.delete(directoryPath);
    }

    // Delete the directory and all subdirectories
    const dirsToDelete = this.getAllSubdirectories(directoryPath);
    for (const dirPath of dirsToDelete) {
      delete this.directories[dirPath];

      // Notify watchers
      if (this.watchers[dirPath]) {
        this.watchers[dirPath].forEach((callback) => callback());
      }
    }

    // Notify global watchers
    this.notifyGlobalWatchers();
  }

  private getAllFilesInDirectory(dirPath: string): string[] {
    const result: string[] = [];
    const dir = this.directories[dirPath];

    if (!dir) return result;

    // Add direct files
    result.push(...Array.from(dir.files));

    // Add files from subdirectories
    for (const subdir of dir.subdirectories) {
      result.push(...this.getAllFilesInDirectory(subdir));
    }

    return result;
  }

  private getAllSubdirectories(dirPath: string): string[] {
    const result: string[] = [dirPath];
    const dir = this.directories[dirPath];

    if (!dir) return result;

    // Add subdirectories recursively
    for (const subdir of dir.subdirectories) {
      result.push(...this.getAllSubdirectories(subdir));
    }

    return result;
  }

  private getParentDirectoryPath(dirPath: string): string | null {
    if (dirPath === "/") return null; // Root has no parent

    const parts = dirPath.split("/").filter(Boolean);
    if (parts.length === 0) return null;

    parts.pop(); // Remove last part
    return parts.length === 0 ? "/" : `/${parts.join("/")}/`;
  }

  async deleteFile(path: string): Promise<void> {
    const normalizedPath = normalizePath(path);

    if (!this.files[normalizedPath]) {
      return; // File doesn't exist, nothing to delete
    }

    // Remove from directory
    const dirPath = this.getDirectoryForFile(normalizedPath);
    if (this.directories[dirPath]) {
      this.directories[dirPath].files.delete(normalizedPath);
    }

    // Delete file
    delete this.files[normalizedPath];

    // Notify watchers
    if (this.watchers[normalizedPath]) {
      this.watchers[normalizedPath].forEach((callback) => callback());
    }

    // Notify global watchers
    this.notifyGlobalWatchers();
  }

  private notifyGlobalWatchers(): void {
    this.globalWatchers.forEach((callback) => callback());
  }

  watch(callback: () => void): () => void {
    this.globalWatchers.add(callback);

    // Return unwatch function
    return () => {
      this.globalWatchers.delete(callback);
    };
  }

  watchDirectory(path: string, callback: () => void): () => void {
    const normalizedPath = normalizePath(path);
    if (!this.watchers[normalizedPath]) {
      this.watchers[normalizedPath] = new Set();
    }

    this.watchers[normalizedPath].add(callback);

    return () => {
      this.watchers[normalizedPath].delete(callback);
    };
  }

  dispose() {
    // Clean up watchers
    for (const path in this.watchers) {
      this.watchers[path].clear();
    }

    this.watchers = {};
    this.globalWatchers.clear();
    this.files = {};
    this.directories = {
      "/": {
        name: "/",
        path: "/",
        files: new Set<string>(),
        subdirectories: new Set<string>(),
      },
    };
  }
}
