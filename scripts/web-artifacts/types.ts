type WebArtifactRuntimeKind = 'callable' | 'component' | 'value';

export interface WebArtifactRuntimeExport {
  readonly exportName: string;
  readonly runtimeKind: WebArtifactRuntimeKind;
}

export interface WebArtifactManifestEntry {
  readonly component: string;
  readonly exportName: string;
  readonly featurePath: string;
  readonly files: readonly string[];
  readonly sourceKind: 'public' | 'web-artifact';
}

export interface WebArtifactTarget {
  readonly component: string;
  readonly declarationSource?: string;
  readonly exportName: string;
  readonly featurePath: string;
  readonly runtimeKind: WebArtifactRuntimeKind;
  readonly runtimeExports: readonly WebArtifactRuntimeExport[];
  readonly sourceEntry: string;
  readonly sourceKind: 'public' | 'web-artifact';
}
