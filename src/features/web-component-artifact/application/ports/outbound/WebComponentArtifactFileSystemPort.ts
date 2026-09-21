export interface WebComponentArtifactFileSystemPort {
  joinPath(...parts: readonly string[]): string;
  createStageDirectoryAsync(outputDirectory: string): Promise<string>;
  commitStageDirectoryAsync(stageDirectory: string, outputDirectory: string): Promise<void>;
  removeStageDirectoryAsync(stageDirectory: string): Promise<void>;
  ensureDirectoryAsync(path: string): Promise<void>;
  readTextFileAsync(path: string): Promise<string>;
  writeTextFileAsync(path: string, content: string): Promise<void>;
}
