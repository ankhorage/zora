export interface WebComponentArtifactFileSystemPort {
  ensureDirectoryAsync(path: string): Promise<void>;
  readTextFileAsync(path: string): Promise<string>;
  writeTextFileAsync(path: string, content: string): Promise<void>;
}
